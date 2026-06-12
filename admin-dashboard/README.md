# Bansos Netflix - Admin Dashboard

Web-based admin dashboard untuk mengelola file txt dalam bulk. Deploy ke Cloudflare Pages.

## 🚀 Quick Start

### Development

1. **Install dependencies:**
```bash
cd admin-dashboard
npm install
```

2. **Setup environment:**
```bash
cp .env.example .env
# Edit .env dan set VITE_API_URL ke backend API URL
```

3. **Run development server:**
```bash
npm run dev
```

Server akan running di `http://localhost:5173`

### Production Build

```bash
npm run build
```

Output akan ada di folder `dist/`

## 🚢 Deployment to Cloudflare Pages

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Deploy

```bash
npm run deploy
```

Atau manual:
```bash
npm run build
wrangler pages deploy dist
```

## 📁 Project Structure

```
admin-dashboard/
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Header with logout
│   │   └── FileManagement.jsx # File upload & management
│   ├── pages/
│   │   ├── Login.jsx          # Admin login
│   │   └── Dashboard.jsx      # Main dashboard
│   ├── services/
│   │   └── api.js             # API client
│   ├── styles/
│   │   ├── global.css         # Global styles
│   │   ├── login.css          # Login styles
│   │   ├── header.css         # Header styles
│   │   ├── dashboard.css      # Dashboard styles
│   │   └── file-management.css # File management styles
│   ├── App.jsx                # Root component
│   ├── App.css                # App styles
│   └── main.jsx               # Entry point
├── index.html                 # HTML template
├── vite.config.js             # Vite config
├── package.json
├── .env.example
└── README.md
```

## ✨ Features

- **🔐 Secure Login** - JWT authentication
- **📤 Bulk Upload** - Upload multiple .txt files at once
- **🗑️ Bulk Delete** - Delete multiple files with one click
- **🔍 Search** - Filter files by filename
- **✅ Select All** - Quickly select/deselect all files
- **📱 Responsive** - Works on desktop and tablet
- **⚡ Fast** - Built with Vite for production

## 🔧 Configuration

### API URL

Edit `.env`:
```
VITE_API_URL=https://api.yourdomain.com
```

Atau default ke `https://localhost:5000` untuk development.

## 📝 Usage

1. **Login** dengan admin credentials
2. **Upload Files:**
   - Drag & drop files atau click area
   - Select multiple .txt files
   - Files akan ter-upload otomatis
3. **Manage Files:**
   - Search files by name
   - Select files untuk delete
   - Bulk delete dengan confirmation
4. **Logout:**
   - Click logout button di header
   - Session akan clear

## 🔐 Security Notes

- Tokens stored di localStorage (untuk development)
- Gunakan HTTPS di production
- Change API_URL ke domain yang aman
- Token expire setelah 7 hari

## 🛠️ Development Tips

### Adding New Component

1. Create di `src/components/ComponentName.jsx`
2. Create CSS di `src/styles/component-name.css`
3. Import di parent component

### Debugging

- Open Chrome DevTools (F12)
- Check Network tab untuk API calls
- Console untuk error messages

### Environment Variables

Add variables di `.env` with `VITE_` prefix:
```
VITE_MY_VAR=value
```

Access dalam code:
```javascript
import.meta.env.VITE_MY_VAR
```

## 📦 Dependencies

- **React 18** - UI framework
- **Vite** - Build tool
- **Axios** - HTTP client (optional, using fetch)

## 🚀 Performance Optimization

- Lazy loading (dapat di-add)
- Code splitting (Vite automatic)
- CSS optimization
- Image optimization

## 🐛 Troubleshooting

### Port 5173 already in use

```bash
# Kill process or use different port
npm run dev -- --port 3000
```

### CORS errors

Ensure backend CORS configured untuk dashboard URL

### API connection failed

- Check `VITE_API_URL` di `.env`
- Pastikan backend running
- Check browser console untuk error

## 📝 License

MIT

---

Created with ❤️ by Rendyprobe

## 🎯 Next Steps

- [ ] Add user management UI (admin panel)
- [ ] Add file preview feature
- [ ] Add audit logs viewer
- [ ] Add dark mode
- [ ] Add pagination untuk file list
