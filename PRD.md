# Product Requirements Document (PRD)
## Bansos Netflix - Browser Extension + Admin Dashboard

**Version:** 1.0  
**Date:** June 12, 2026  
**Status:** Draft for Review  

---

## 📋 Executive Summary

Transform Bansos Netflix dari terminal CLI tool menjadi ecosystem yang aman dengan:
1. **Browser Extension** - User interface yang intuitif dengan login authentication
2. **Backend API** - PostgreSQL database untuk menyimpan data terpusat dan aman
3. **Admin Dashboard** - Web app untuk admin mengelola file txt dalam jumlah banyak

---

## 🎯 Project Goals

- ✅ Memberikan user experience yang lebih baik (GUI vs Terminal)
- ✅ Keamanan data dengan authentication (username/password)
- ✅ Centralized data management via database
- ✅ Admin control panel untuk manage content
- ✅ Prevent unauthorized access ke file txt

---

## 📱 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE OVERVIEW                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  Browser Client  │
│  (Chrome/Firefox)│
└────────┬─────────┘
         │
    ┌────▼─────┐
    │ Extension │◄──────┐
    │ (Login UI)│       │
    └────┬──────┘       │
         │              │
    API Calls      Local Storage
    (HTTPS)        (Auth Token)
         │
    ┌────▼───────────────────────┐
    │    Backend API Server      │
    │  (Node.js/Express/FastAPI) │
    │  ✓ Authentication          │
    │  ✓ Token Validation        │
    │  ✓ Data Management         │
    └────┬──────────────────────┘
         │
    ┌────▼────────────────┐
    │  PostgreSQL (Neon)  │
    │  ✓ users table      │
    │  ✓ bahan_txt table  │
    │  ✓ audit logs       │
    └─────────────────────┘

┌──────────────────────────────┐
│   Admin Dashboard (Web App)   │
│   (Deployed to Cloudflare)    │
│  ✓ Upload/Delete file txt     │
│  ✓ Bulk Operations            │
│  ✓ User Management            │
└────────────┬─────────────────┘
             │
         API Calls
         (HTTPS)
             │
      ┌──────▼───────────────────┐
      │   Shared Backend API      │
      │   (Same as Extension)     │
      └──────────────────────────┘
```

---

## 🏗️ Technical Stack

### Frontend - Browser Extension
- **Framework:** Vanilla JavaScript (ES6+)
- **UI Framework:** Tailwind CSS + HTML5
- **Storage:** Chrome Storage API (extension storage)
- **Build Tool:** Webpack / Parcel

### Frontend - Admin Dashboard
- **Framework:** React 18+ / Vue 3
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Hosting:** Cloudflare Pages / Workers

### Backend
- **Runtime:** Node.js 18+ dengan Express.js
- **OR:** Python dengan FastAPI
- **Authentication:** JWT (JSON Web Tokens)
- **Database:** PostgreSQL (Neon)
- **Deployment:** Railway / Render / Heroku

### Database
- **Provider:** Neon (PostgreSQL)
- **Connection String:** Provided by user
- **SSL:** Required

---

## 🗄️ Database Schema

### Table: `users`
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' (user, admin),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

### Table: `bahan_txt`
```sql
CREATE TABLE bahan_txt (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  uploaded_by INT REFERENCES users(id),
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

### Table: `audit_logs`
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  action VARCHAR(50),
  resource_type VARCHAR(50),
  resource_id INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  details TEXT
);
```

---

## 🔐 Authentication & Security

### Login Flow
1. User install extension → First time load login page
2. User input username & password
3. Backend validate credentials
4. Return JWT token
5. Extension store token di Chrome Storage API
6. Token attach ke setiap API request

### Token Management
- **Token Type:** JWT (JSON Web Token)
- **Expiration:** 7 days
- **Refresh:** Auto-refresh jika mendekati expiration
- **Storage:** Chrome Storage (encrypted by browser)

### Password Security
- **Hashing:** bcrypt dengan salt rounds 10
- **Validation:** Min 8 chars, uppercase, number, special char
- **HTTPS Only:** Semua API calls wajib HTTPS

---

## 📋 Features

### Browser Extension

#### 1. **Login Page**
- Username & password input
- Validation error messages
- "Remember me" option (optional)
- Sign-up button (redirect ke admin untuk register)
- Responsive design

#### 2. **Main Dashboard**
After login, user dapat:
- ✓ View list semua available bahan_txt
- ✓ Copy content ke clipboard
- ✓ Generate token/URL dari bahan
- ✓ Search/filter bahan
- ✓ Logout button
- ✓ Profile section (username, role)

#### 3. **Generate Token Feature**
- Select bahan txt dari list
- Click "Generate Token"
- API call ke backend
- Return URL/token
- Copy button di UI

### Admin Dashboard (Web App)

#### 1. **Authentication**
- Login dengan admin credentials
- Session management
- Logout

#### 2. **Bulk File Management**
- Upload multiple txt files sekaligus
- Preview file sebelum upload
- Delete file (single atau bulk delete)
- Edit file content
- Search & filter

#### 3. **User Management** (Optional Phase 2)
- Create/delete user accounts
- Reset password
- View user activity logs
- Manage user roles

#### 4. **Dashboard Stats**
- Total files
- Total users
- Recent uploads
- Activity chart

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login           - Login dengan username/password
POST   /api/auth/register        - Admin create new user
POST   /api/auth/refresh         - Refresh JWT token
POST   /api/auth/logout          - Logout
```

### Bahan Txt Management
```
GET    /api/bahan                - List semua bahan (auth required)
GET    /api/bahan/:id            - Get bahan detail
POST   /api/bahan                - Create new bahan (admin only)
PUT    /api/bahan/:id            - Update bahan (admin only)
DELETE /api/bahan/:id            - Delete bahan (admin only)
POST   /api/bahan/bulk-upload    - Bulk upload files (admin only)
POST   /api/bahan/bulk-delete    - Bulk delete bahan (admin only)
```

### User Management
```
GET    /api/users                - List users (admin only)
GET    /api/users/me             - Get current user info
POST   /api/users                - Create user (admin only)
PUT    /api/users/:id            - Update user (admin only)
DELETE /api/users/:id            - Delete user (admin only)
```

### Token Generation
```
POST   /api/generate-token       - Generate token dari bahan (user)
```

---

## 📁 Project Structure

```
bansos-netflix-extension/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── bahanController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── BahanTxt.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── bahan.js
│   │   │   └── user.js
│   │   └── app.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── extension/
│   ├── src/
│   │   ├── manifest.json
│   │   ├── popup/
│   │   │   ├── popup.html
│   │   │   ├── popup.css
│   │   │   └── popup.js
│   │   ├── pages/
│   │   │   ├── login.html
│   │   │   ├── login.css
│   │   │   └── login.js
│   │   ├── pages/
│   │   │   ├── dashboard.html
│   │   │   ├── dashboard.css
│   │   │   └── dashboard.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── storage.js
│   │   │   └── auth.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   └── styles/
│   │       └── tailwind.css
│   ├── package.json
│   └── README.md
│
├── admin-dashboard/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── FileList.jsx
│   │   │   ├── BulkActions.jsx
│   │   │   └── UserManagement.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FileManagement.jsx
│   │   │   └── Users.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
└── docs/
    ├── API.md
    ├── DEPLOYMENT.md
    └── DEVELOPMENT.md
```

---

## 📊 Data Flow

### User Login (Extension)
```
1. User install extension
2. Extension load → Check if token exist in storage
3. If NO → Show login page
4. User input username & password
5. Send POST /api/auth/login
6. Backend validate & return JWT token
7. Extension store token di Chrome Storage
8. Redirect to main dashboard
```

### User Generate Token (Extension)
```
1. User view list bahan_txt
2. Select bahan → Click "Generate"
3. Send POST /api/generate-token (with JWT)
4. Backend validate JWT & generate token
5. Return URL/token ke extension
6. Show in UI with copy button
```

### Admin Upload Files (Dashboard)
```
1. Admin login ke dashboard
2. Go to "File Management"
3. Upload multiple txt files
4. Send POST /api/bahan/bulk-upload (with FormData)
5. Backend process files → Extract content → Save to DB
6. Return success response
7. Show files in list
```

### Admin Delete Files (Dashboard)
```
1. Admin select files to delete
2. Click bulk delete
3. Send POST /api/bahan/bulk-delete (with file IDs)
4. Backend validate & delete from DB
5. Return success response
6. Update UI
```

---

## 🚀 Development Phases

### Phase 1: Backend API (Week 1)
- ✓ Setup Express.js + PostgreSQL connection
- ✓ Create database schema
- ✓ Implement authentication (login, JWT)
- ✓ Create CRUD endpoints for bahan
- ✓ Error handling & validation

### Phase 2: Browser Extension (Week 2)
- ✓ Setup extension project structure
- ✓ Create login page UI
- ✓ Implement authentication flow
- ✓ Create main dashboard
- ✓ Implement API calls
- ✓ Token generation feature

### Phase 3: Admin Dashboard (Week 2-3)
- ✓ Setup React + Vite
- ✓ Create admin login page
- ✓ File upload component
- ✓ File management UI
- ✓ Bulk delete feature
- ✓ User management (optional)

### Phase 4: Deployment (Week 3)
- ✓ Deploy backend to Railway/Render
- ✓ Setup environment variables
- ✓ Deploy admin dashboard to Cloudflare Pages
- ✓ Test all features
- ✓ Document deployment process

---

## ✅ Acceptance Criteria

### Backend
- [ ] All API endpoints working
- [ ] JWT authentication implemented
- [ ] Password hashing with bcrypt
- [ ] HTTPS enforced
- [ ] Error handling comprehensive
- [ ] Database queries optimized
- [ ] CORS configured properly

### Browser Extension
- [ ] Extension install without errors
- [ ] Login page working correctly
- [ ] JWT token stored securely
- [ ] Main dashboard displays bahan list
- [ ] Generate token feature working
- [ ] Copy to clipboard working
- [ ] Logout functionality working
- [ ] Responsive UI

### Admin Dashboard
- [ ] Admin login working
- [ ] Bulk upload files working
- [ ] Files saved to database correctly
- [ ] File list display properly
- [ ] Delete feature working
- [ ] Bulk delete working
- [ ] UI responsive & user-friendly
- [ ] Deployed to Cloudflare successfully

---

## 📚 Technology Checklist

- [ ] Node.js + Express.js
- [ ] PostgreSQL (Neon)
- [ ] JWT Authentication
- [ ] bcrypt (password hashing)
- [ ] CORS middleware
- [ ] Dotenv for env variables
- [ ] Chrome Extension APIs
- [ ] React + Vite
- [ ] Tailwind CSS
- [ ] Axios (HTTP client)

---

## 🔒 Security Considerations

1. **Password Security**
   - Minimum 8 characters
   - Bcrypt hashing with 10 salt rounds
   - No password storage in plain text

2. **API Security**
   - HTTPS only
   - JWT token validation on every request
   - CORS whitelist specific domains
   - Rate limiting (optional)

3. **Data Protection**
   - SQL injection prevention (use parameterized queries)
   - XSS prevention (sanitize inputs)
   - CSRF protection

4. **Storage Security**
   - Chrome Storage API encryption
   - No sensitive data in LocalStorage
   - Secure token handling

---

## 💰 Hosting Costs (Estimated)

- **Backend:** Railway/Render ~$5-10/month
- **Database:** Neon Free tier (sufficient)
- **Admin Dashboard:** Cloudflare Pages Free tier
- **Domain:** Optional, $0-12/year
- **Total:** ~$5-10/month

---

## 📝 Notes

- PostgreSQL connection string sudah disediakan user
- File txt di-upload sebagai text → disimpan di database
- Users tidak bisa akses file txt secara langsung (via database only)
- Admin memiliki full control atas file management
- Extension JWT token auto-refresh sebelum expired

---

## 👥 Team & Roles

- **Backend Developer**: API & Database management
- **Frontend Developer (Extension)**: UI/UX Extension
- **Frontend Developer (Dashboard)**: Admin interface
- **DevOps**: Deployment & Infrastructure

---

## 📞 Review Checklist

- [ ] Architecture approved
- [ ] Database schema approved
- [ ] API endpoints approved
- [ ] Security measures approved
- [ ] Tech stack approved
- [ ] Timeline approved

**Next Step:** Await approval, then proceed to execution phase.

---

*PRD Version 1.0 - Ready for Review*
