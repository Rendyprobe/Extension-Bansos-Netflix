import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const encoder = new TextEncoder();
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
    },
  });
}

function base64UrlEncode(value) {
  const bytes = typeof value === 'string' ? encoder.encode(value) : new Uint8Array(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function base64UrlDecode(value) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function importJwtKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

async function createToken(payload, secret) {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
  }));
  const content = `${header}.${body}`;
  const signature = await crypto.subtle.sign(
    'HMAC',
    await importJwtKey(secret),
    encoder.encode(content),
  );
  return `${content}.${base64UrlEncode(signature)}`;
}

async function verifyToken(request, secret) {
  const authorization = request.headers.get('Authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');

  const valid = await crypto.subtle.verify(
    'HMAC',
    await importJwtKey(secret),
    base64UrlDecode(parts[2]),
    encoder.encode(`${parts[0]}.${parts[1]}`),
  );
  if (!valid) throw new Error('Invalid token');

  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[1])));
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Expired token');
  }
  return payload;
}

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function requireAdmin(user) {
  if (user.role !== 'admin') {
    return json({ message: 'Admin access required' }, 403);
  }
  return null;
}

async function handleLogin(request, sql, env) {
  const { username, password } = await readBody(request);
  if (!username || !password) {
    return json({ message: 'Username and password required' }, 400);
  }

  const rows = await sql.query(
    'SELECT * FROM users WHERE username = $1 AND is_active = true LIMIT 1',
    [username],
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return json({ message: 'Invalid credentials' }, 401);
  }

  const publicUser = { id: user.id, username: user.username, role: user.role };
  const token = await createToken(publicUser, env.JWT_SECRET);
  return json({ token, user: publicUser });
}

async function handleRequest(request, env) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const sql = neon(env.DATABASE_URL);

  if (request.method === 'GET' && path === '/health') {
    const rows = await sql.query('SELECT NOW() AS now');
    return json({ status: 'OK', database: 'connected', timestamp: rows[0].now });
  }

  if (request.method === 'POST' && path === '/api/auth/login') {
    return handleLogin(request, sql, env);
  }

  let user;
  try {
    user = await verifyToken(request, env.JWT_SECRET);
  } catch {
    return json({ message: 'Invalid or expired token' }, 401);
  }

  if (request.method === 'GET' && path === '/api/auth/me') {
    const rows = await sql.query(
      'SELECT id, username, role, created_at FROM users WHERE id = $1 AND is_active = true',
      [user.id],
    );
    return rows[0] ? json(rows[0]) : json({ message: 'User not found' }, 404);
  }

  if (request.method === 'GET' && path === '/api/bahan') {
    const rows = await sql.query(`
      SELECT id, filename, uploaded_by, upload_date, updated_at
      FROM bahan_txt
      WHERE is_active = true
      ORDER BY upload_date DESC
    `);
    return json(rows);
  }

  const bahanMatch = path.match(/^\/api\/bahan\/(\d+)$/);
  if (request.method === 'GET' && bahanMatch) {
    const rows = await sql.query(
      `SELECT id, filename, content, uploaded_by, upload_date, updated_at
       FROM bahan_txt WHERE id = $1 AND is_active = true`,
      [Number(bahanMatch[1])],
    );
    return rows[0] ? json(rows[0]) : json({ message: 'Bahan not found' }, 404);
  }

  if (request.method === 'POST' && path === '/api/bahan/bulk-upload') {
    const denied = requireAdmin(user);
    if (denied) return denied;
    const { bahanArray, duplicateMode = 'merge' } = await readBody(request);
    if (!Array.isArray(bahanArray) || bahanArray.length === 0) {
      return json({ message: 'Bahan array is required' }, 400);
    }
    if (!['merge', 'skip', 'replace'].includes(duplicateMode)) {
      return json({ message: 'Invalid duplicate mode' }, 400);
    }

    const results = [];
    const summary = { inserted: 0, merged: 0, replaced: 0, skipped: 0 };

    for (const item of bahanArray) {
      if (!item.filename || !item.content) {
        return json({ message: 'Each bahan requires filename and content' }, 400);
      }

      const existingRows = await sql.query(
        `SELECT id, filename, content
         FROM bahan_txt
         WHERE LOWER(filename) = LOWER($1) AND is_active = true
         ORDER BY id
         LIMIT 1`,
        [item.filename.trim()],
      );
      const existing = existingRows[0];

      if (!existing) {
        const rows = await sql.query(
          `INSERT INTO bahan_txt (filename, content, uploaded_by)
           VALUES ($1, $2, $3)
           RETURNING id, filename, upload_date, updated_at`,
          [item.filename.trim(), item.content, user.id],
        );
        summary.inserted += 1;
        results.push({ ...rows[0], action: 'inserted' });
        continue;
      }

      if (duplicateMode === 'skip') {
        summary.skipped += 1;
        results.push({ id: existing.id, filename: existing.filename, action: 'skipped' });
        continue;
      }

      const content = duplicateMode === 'merge'
        ? [existing.content.trimEnd(), item.content.trimStart()].filter(Boolean).join('\n')
        : item.content;
      const rows = await sql.query(
        `UPDATE bahan_txt
         SET content = $1,
             uploaded_by = $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING id, filename, upload_date, updated_at`,
        [content, user.id, existing.id],
      );
      const action = duplicateMode === 'merge' ? 'merged' : 'replaced';
      summary[action] += 1;
      results.push({ ...rows[0], action });
    }

    return json({
      message: 'Files processed successfully',
      summary,
      data: results,
    }, 201);
  }

  if (request.method === 'POST' && path === '/api/bahan/bulk-delete') {
    const denied = requireAdmin(user);
    if (denied) return denied;
    const { ids } = await readBody(request);
    if (!Array.isArray(ids) || ids.length === 0) {
      return json({ message: 'IDs array is required' }, 400);
    }

    const rows = await sql.query(
      'UPDATE bahan_txt SET is_active = false WHERE id = ANY($1::int[]) RETURNING id',
      [ids],
    );
    return json({ message: `${rows.length} bahan deleted successfully`, data: rows });
  }

  if (request.method === 'GET' && path === '/api/users') {
    const denied = requireAdmin(user);
    if (denied) return denied;
    const rows = await sql.query(
      'SELECT id, username, role, created_at, is_active FROM users ORDER BY created_at DESC',
    );
    return json(rows);
  }

  if (request.method === 'POST' && path === '/api/users') {
    const denied = requireAdmin(user);
    if (denied) return denied;
    const { username, password, role = 'user' } = await readBody(request);
    const normalizedUsername = typeof username === 'string' ? username.trim() : '';

    if (!normalizedUsername || !password) {
      return json({ message: 'Username and password required' }, 400);
    }
    if (normalizedUsername.length < 3 || normalizedUsername.length > 50) {
      return json({ message: 'Username must be between 3 and 50 characters' }, 400);
    }
    if (password.length < 8) {
      return json({ message: 'Password must be at least 8 characters' }, 400);
    }
    if (!['user', 'admin'].includes(role)) {
      return json({ message: 'Role must be user or admin' }, 400);
    }

    const existing = await sql.query(
      'SELECT id FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1',
      [normalizedUsername],
    );
    if (existing[0]) {
      return json({ message: 'Username already exists' }, 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const rows = await sql.query(
      `INSERT INTO users (username, password_hash, role)
       VALUES ($1, $2, $3)
       RETURNING id, username, role, created_at, is_active`,
      [normalizedUsername, passwordHash, role],
    );
    return json(rows[0], 201);
  }

  const userMatch = path.match(/^\/api\/users\/(\d+)$/);
  if (request.method === 'DELETE' && userMatch) {
    const denied = requireAdmin(user);
    if (denied) return denied;
    const userId = Number(userMatch[1]);
    if (userId === user.id) {
      return json({ message: 'Cannot deactivate your own account' }, 400);
    }

    const rows = await sql.query(
      `UPDATE users
       SET is_active = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_active = true
       RETURNING id`,
      [userId],
    );
    return rows[0]
      ? json({ message: 'User deactivated successfully' })
      : json({ message: 'Active user not found' }, 404);
  }

  return json({ message: 'Route not found' }, 404);
}

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      console.error(error);
      return json({ message: 'Internal server error' }, 500);
    }
  },
};
