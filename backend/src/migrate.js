import pool from './config/database.js';

const createTables = async () => {
  try {
    console.log('🔄 Creating database tables...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      );
    `);
    console.log('✅ Users table created');

    // Create bahan_txt table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bahan_txt (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        uploaded_by INT REFERENCES users(id),
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      );
    `);
    console.log('✅ Bahan_txt table created');

    // Create audit_logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        action VARCHAR(50),
        resource_type VARCHAR(50),
        resource_id INT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        details TEXT
      );
    `);
    console.log('✅ Audit_logs table created');

    console.log('✅ All tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    process.exit(1);
  }
};

createTables();
