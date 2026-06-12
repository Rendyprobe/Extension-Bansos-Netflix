# Extension Bansos Netflix

Repository ini berisi tiga aplikasi aktif:

- `admin-dashboard`: dashboard React yang dideploy ke Cloudflare Pages.
- `backend-worker`: API Cloudflare Worker yang terhubung ke PostgreSQL Neon.
- `extension`: browser extension Manifest V3 untuk pengguna.

## URL Production

- Admin dashboard: https://bansos-netflix-admin.pages.dev
- Installer extension: https://bansos-netflix-admin.pages.dev/install
- API health check: https://bansos-netflix-api.25051204307.workers.dev/health

## Admin Dashboard

```bash
cd admin-dashboard
npm install
npm run dev
```

Build production:

```bash
npm run build
```

Konfigurasi lokal disimpan di `.env`:

```env
VITE_API_URL=https://bansos-netflix-api.example.workers.dev
VITE_EXTENSION_STORE_URL=
```

Jangan commit file `.env`.

## Cloudflare Worker

```bash
cd backend-worker
npm install
npx wrangler secret put DATABASE_URL
npx wrangler secret put JWT_SECRET
npm run deploy
```

Secret database dan JWT hanya disimpan sebagai Cloudflare Worker secrets.

## Browser Extension

Source extension berada di `extension/src`.

Untuk instalasi lokal:

1. Buka `chrome://extensions` atau `edge://extensions`.
2. Aktifkan Developer mode.
3. Klik Load unpacked.
4. Pilih folder `extension/src`.

Paket ZIP yang disajikan dashboard berada di:

`admin-dashboard/public/downloads/bansos-netflix-extension.zip`

## Verifikasi

```bash
cd admin-dashboard && npm run build
cd ../backend-worker && node --check src/index.js
```

Seluruh file environment, dependency hasil instalasi, output build, cache,
dataset lokal, dan credential harus tetap berada di luar Git.
