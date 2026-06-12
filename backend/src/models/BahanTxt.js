import pool from '../config/database.js';

export class BahanTxt {
  static async create(filename, content, uploadedBy) {
    const query = `
      INSERT INTO bahan_txt (filename, content, uploaded_by)
      VALUES ($1, $2, $3)
      RETURNING id, filename, uploaded_by, upload_date
    `;
    const result = await pool.query(query, [filename, content, uploadedBy]);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT id, filename, uploaded_by, upload_date, updated_at
      FROM bahan_txt
      WHERE is_active = true
      ORDER BY upload_date DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT id, filename, content, uploaded_by, upload_date, updated_at
      FROM bahan_txt
      WHERE id = $1 AND is_active = true
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, filename, content) {
    const query = `
      UPDATE bahan_txt
      SET filename = $1, content = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 AND is_active = true
      RETURNING id, filename, updated_at
    `;
    const result = await pool.query(query, [filename, content, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = `
      UPDATE bahan_txt
      SET is_active = false
      WHERE id = $1
      RETURNING id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async bulkCreate(bahanArray) {
    const values = bahanArray.map((bahan, index) => {
      const offset = index * 3;
      return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
    }).join(',');

    const params = bahanArray.flatMap(bahan => [bahan.filename, bahan.content, bahan.uploadedBy]);

    const query = `
      INSERT INTO bahan_txt (filename, content, uploaded_by)
      VALUES ${values}
      RETURNING id, filename, upload_date
    `;
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async bulkDelete(ids) {
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(',');
    const query = `
      UPDATE bahan_txt
      SET is_active = false
      WHERE id IN (${placeholders})
      RETURNING id
    `;
    const result = await pool.query(query, ids);
    return result.rows;
  }
}
