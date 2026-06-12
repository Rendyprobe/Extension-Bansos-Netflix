# Bansos Netflix - Backend API

Backend API untuk Bansos Netflix Browser Extension dan Admin Dashboard.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` dan pastikan `DATABASE_URL` dan `JWT_SECRET` sudah benar.

### 3. Run Database Migration
```bash
npm run migrate
```

### 4. Start Development Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "user@example.com",
    "role": "user"
  }
}
```

#### Register (Admin Only)
```
POST /api/auth/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "role": "user"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "username": "user@example.com",
  "role": "user",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Bahan Management Endpoints

#### Get All Bahan
```
GET /api/bahan
Authorization: Bearer <token>

Response:
[
  {
    "id": 1,
    "filename": "bahan1.txt",
    "uploaded_by": 1,
    "upload_date": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Bahan by ID
```
GET /api/bahan/:id
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "filename": "bahan1.txt",
  "content": "bahan content...",
  "uploaded_by": 1,
  "upload_date": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Create Bahan (Admin Only)
```
POST /api/bahan
Authorization: Bearer <token>
Content-Type: application/json

{
  "filename": "bahan1.txt",
  "content": "bahan content here"
}

Response:
{
  "id": 1,
  "filename": "bahan1.txt",
  "uploaded_by": 1,
  "upload_date": "2024-01-01T00:00:00Z"
}
```

#### Update Bahan (Admin Only)
```
PUT /api/bahan/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "filename": "bahan1_updated.txt",
  "content": "updated content"
}
```

#### Delete Bahan (Admin Only)
```
DELETE /api/bahan/:id
Authorization: Bearer <token>
```

#### Bulk Upload Bahan (Admin Only)
```
POST /api/bahan/bulk-upload
Authorization: Bearer <token>
Content-Type: application/json

{
  "bahanArray": [
    {
      "filename": "bahan1.txt",
      "content": "content1"
    },
    {
      "filename": "bahan2.txt",
      "content": "content2"
    }
  ]
}
```

#### Bulk Delete Bahan (Admin Only)
```
POST /api/bahan/bulk-delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

### User Management Endpoints

#### Get All Users (Admin Only)
```
GET /api/users
Authorization: Bearer <token>
```

#### Delete User (Admin Only)
```
DELETE /api/users/:id
Authorization: Bearer <token>
```

## 🔐 Authentication

Semua request (kecuali `/api/auth/login` dan `/api/auth/register`) memerlukan JWT token di header:

```
Authorization: Bearer <your_jwt_token>
```

Token berlaku selama 7 hari.

## 🗄️ Database Schema

### Users Table
```sql
- id (SERIAL PRIMARY KEY)
- username (VARCHAR UNIQUE)
- password_hash (VARCHAR)
- role (VARCHAR: 'user' atau 'admin')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- is_active (BOOLEAN)
```

### Bahan_txt Table
```sql
- id (SERIAL PRIMARY KEY)
- filename (VARCHAR)
- content (TEXT)
- uploaded_by (INT - FK to users)
- upload_date (TIMESTAMP)
- updated_at (TIMESTAMP)
- is_active (BOOLEAN)
```

### Audit_logs Table
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INT - FK to users)
- action (VARCHAR)
- resource_type (VARCHAR)
- resource_id (INT)
- timestamp (TIMESTAMP)
- ip_address (VARCHAR)
- details (TEXT)
```

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── bahanController.js   # Bahan CRUD
│   │   └── userController.js    # User management
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js              # User DB operations
│   │   └── BahanTxt.js          # Bahan DB operations
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── bahan.js             # Bahan routes
│   │   └── user.js              # User routes
│   ├── app.js                   # Express app
│   └── migrate.js               # Database migration
├── .env.example
├── package.json
└── README.md
```

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server dengan nodemon
- `npm start` - Start production server
- `npm run migrate` - Run database migration

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key untuk JWT signing
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## ⚠️ Important Notes

1. **Database Migration**: Jalankan `npm run migrate` sekali saat setup pertama kali
2. **JWT Secret**: Ubah `JWT_SECRET` di `.env` dengan value yang aman
3. **CORS**: Configure CORS sesuai domain extension dan admin dashboard
4. **HTTPS**: Gunakan HTTPS di production

## 📝 License

MIT

---

Created with ❤️ by Rendyprobe
