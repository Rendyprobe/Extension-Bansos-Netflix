# Bansos Netflix - Browser Extension

Chrome/Firefox browser extension untuk Bansos Netflix token generation dan management.

## 🚀 Installation

### Development

1. **Clone repo** (sudah ada)

2. **Load Extension di Chrome:**
   - Buka `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select folder `extension/src`
   - Extension akan muncul di toolbar

3. **First Time Setup:**
   - Click extension icon di toolbar
   - Extension akan menampilkan login page
   - Masukkan username & password yang sudah didaftarkan

### Production

Siap untuk di-submit ke Chrome Web Store atau Firefox Add-ons.

## 📋 Features

### ✅ Implemented

- **Login Page** - Secure authentication dengan username & password
- **Dashboard** - View semua available bahan
- **Generate Token** - Generate token dari selected bahan
- **Copy to Clipboard** - Quick copy dari token/content
- **Search** - Filter bahan berdasarkan filename
- **Logout** - Clear session dan logout
- **Secure Storage** - Token disimpan di Chrome Storage API (encrypted by browser)

### 📁 File Structure

```
extension/
├── src/
│   ├── manifest.json              # Extension metadata
│   ├── popup.html                 # Popup entry point
│   ├── popup.js                   # Popup routing logic
│   ├── background.js              # Service worker
│   ├── pages/
│   │   ├── login.html             # Login page
│   │   ├── login.js               # Login logic
│   │   ├── dashboard.html         # Dashboard page
│   │   └── dashboard.js           # Dashboard logic
│   ├── services/
│   │   ├── api.js                 # API calls
│   │   └── storage.js             # Chrome Storage wrapper
│   └── styles/
│       ├── popup.css              # Base styles
│       ├── login.css              # Login styles
│       └── dashboard.css          # Dashboard styles
├── public/
│   ├── icon16.png                 # Extension icon (16x16)
│   ├── icon48.png                 # Extension icon (48x48)
│   └── icon128.png                # Extension icon (128x128)
└── README.md
```

## 🔧 Configuration

### Update API URL

Di file `src/services/api.js`, ubah `getApiUrl()`:

```javascript
async getApiUrl() {
  const result = await chrome.storage.local.get('api_url');
  return result.api_url || 'https://api.yourdomain.com'; // Change this
}
```

Atau set via admin panel (planned untuk phase berikutnya).

## 📝 Usage

1. **Click extension icon** di browser toolbar
2. **First time:** Enter username & password
3. **Dashboard:** View available bahan txt files
4. **Generate:** Click "Generate Token" untuk get content
5. **Copy:** Click "Copy to Clipboard" untuk copy content
6. **Logout:** Click "Logout" untuk session clear

## 🔐 Security Features

- ✅ JWT authentication
- ✅ Secure token storage (Chrome Storage API)
- ✅ HTTPS only API calls
- ✅ XSS prevention (HTML escaping)
- ✅ CSRF protection via SameSite cookies
- ✅ No sensitive data di localStorage

## 🛠️ Development

### Add New Feature

1. Create file di appropriate folder
2. Import di pages yang butuh
3. Test di development
4. Update manifest jika perlu permission baru

### Debugging

1. Open `chrome://extensions`
2. Find "Bansos Netflix"
3. Click "Details" → "Service Worker" untuk background logs
4. Right-click extension → "Inspect popup" untuk popup logs

## 📦 Size & Performance

- **Extension Size:** ~50KB (uncompressed)
- **Runtime Memory:** ~2-5MB
- **Permissions:** Minimal (storage, activeTab)

## 🚢 Deployment

### Chrome Web Store

1. Create Google Developer account
2. Upload `extension/src` as zip
3. Add description, screenshots, icons
4. Submit for review (typically 3-7 days)

### Firefox Add-ons

Similar process dengan mozilla developer account.

## 📝 Known Limitations

- Background sync not implemented (planned Phase 2)
- Auto-logout tidak di-implement (manual logout only)
- Offline mode tidak supported (requires network)

## 🐛 Troubleshooting

### Extension tidak muncul di toolbar
- Reload extension (chrome://extensions → reload)
- Check manifest.json syntax

### Login gagal
- Pastikan backend API running
- Check network tab di DevTools
- Verify credentials

### Token tidak ter-copy
- Check clipboard permissions
- Try manual copy dari text area

## 📞 Support

File issue di GitHub dengan detail:
- Chrome/Firefox version
- Error message
- Steps to reproduce

## 📄 License

MIT

---

Created with ❤️ by Rendyprobe
