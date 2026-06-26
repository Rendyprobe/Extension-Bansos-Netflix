# Admin Dashboard

Dashboard React untuk:

- login administrator;
- upload, gabung, ganti, atau melewati file dengan nama yang sama;
- menghapus file;
- membuat dan menonaktifkan user;
- menyediakan halaman dan ZIP installer extension;
- menyediakan route `/hp` untuk pengguna HP.

## Development

```bash
npm install
cp .env.example .env
npm run dev
```

Environment:

```env
VITE_API_URL=https://bansos-netflix-api.example.workers.dev
VITE_EXTENSION_STORE_URL=
```

## Build

```bash
npm run build
```

Output build berada di `dist` dan tidak dilacak Git.

Route production:

- `/`: admin dashboard.
- `/install`: installer extension.
- `/hp`: versi web pengguna HP.

## Deploy

```bash
npm run deploy
```

Project Cloudflare Pages production menggunakan nama
`bansos-netflix-admin`.

## Extension Package

ZIP extension yang tersedia pada halaman `/install` berada di:

`public/downloads/bansos-netflix-extension.zip`

Regenerasi ZIP setiap source extension berubah:

```bash
cd ../extension
npm run package
```
