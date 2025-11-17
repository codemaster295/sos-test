import db from '../database/database';
import { hashPassword } from '../utils/password';

async function createAdmin() {
  const email = process.argv[2] || 'admin@example.com';
  const password = process.argv[3] || 'admin123';

  try {
    // Check if admin already exists
    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existing) {
      console.log('Admin user already exists with this email');
      process.exit(0);
    }

    const hashedPassword = await hashPassword(password);

    const stmt = db.prepare(`
      INSERT INTO users (email, password, role, name)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(email, hashedPassword, 'admin', 'Admin User');

    console.log('✅ Admin user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`ID: ${result.lastInsertRowid}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();

