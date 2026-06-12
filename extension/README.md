# Browser Extension

Browser extension Manifest V3 untuk login dan mengakses data melalui API
Cloudflare Worker.

## Instalasi Lokal

1. Buka `chrome://extensions` atau `edge://extensions`.
2. Aktifkan Developer mode.
3. Klik Load unpacked.
4. Pilih folder `extension/src`.

## Struktur

```text
src/
├── manifest.json
├── popup.html
├── popup.js
├── pages/
├── services/
└── styles/
```

Extension hanya meminta permission `storage` dan akses ke host API production.
JWT disimpan di `chrome.storage.local`.

## Validasi

```bash
for file in src/*.js src/pages/*.js src/services/*.js; do
  node --check "$file"
done
```

Untuk membuat paket ZIP:

```bash
cd src
zip -qr ../../admin-dashboard/public/downloads/bansos-netflix-extension.zip .
```
