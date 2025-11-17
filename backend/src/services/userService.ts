import db from '../database/database';
import { User, RegisterRequest } from '../types';
import { hashPassword, comparePassword } from '../utils/password';

export class UserService {
  async findByEmail(email: string): Promise<User | null> {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
    return user || null;
  }

  async findById(id: number): Promise<User | null> {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
    return user || null;
  }

  async create(userData: RegisterRequest): Promise<Omit<User, 'password'>> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await hashPassword(userData.password);
    const role = userData.role || 'user';

    const stmt = db.prepare(`
      INSERT INTO users (email, password, role, name)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      userData.email,
      hashedPassword,
      role,
      userData.name || null
    );

    const created = await this.findById(result.lastInsertRowid as number);
    if (!created) {
      throw new Error('Failed to create user');
    }

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = created;
    return userWithoutPassword;
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return null;
    }

    return user;
  }
}

export default new UserService();

