# Extension Bansos Netflix

Repository ini berisi tiga aplikasi aktif:

- `admin-dashboard`: dashboard React yang dideploy ke Cloudflare Pages, termasuk route `/hp` untuk pengguna HP.
- `backend-worker`: API Cloudflare Worker yang terhubung ke PostgreSQL Neon.
- `extension`: browser extension Manifest V3 untuk pengguna.

## URL Production

- Admin dashboard: https://bansos-netflix-admin.pages.dev
- Installer extension: https://bansos-netflix-admin.pages.dev/install
- Versi HP: https://bansosnetflix.my.id/hp
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

Route publik:

- `/install`: halaman download dan panduan install extension.
- `/hp`: versi web untuk user HP dengan flow login, ambil bahan, generate URL.

Deploy dari root repository:

```bash
npm run deploy
```

Hapus Cloudflare Pages project lama jika sempat membuat project web app
terpisah:

```bash
npm run delete-unused-web-app-project
```

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

Regenerasi paket setelah source extension berubah:

```bash
cd extension && npm run package
```

## Verifikasi

```bash
cd admin-dashboard && npm run build
cd ../backend-worker && node --check src/index.js
```

Seluruh file environment, dependency hasil instalasi, output build, cache,
dataset lokal, dan credential harus tetap berada di luar Git.
