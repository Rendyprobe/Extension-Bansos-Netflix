import pool from './src/config/database.js';

try {
  const result = await pool.query('SELECT NOW()');
  console.log('✅ Database connection successful!');
  console.log('Current time:', result.rows[0]);
  process.exit(0);
} catch (error) {
  console.error('❌ Connection error:', error.message);
  console.error('Full error:', error);
  process.exit(1);
}
