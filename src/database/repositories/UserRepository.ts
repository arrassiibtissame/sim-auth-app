import DatabaseService from '../DatabaseService';
import { User } from '../../models';

export class UserRepository {
  async createUser(user: User): Promise<number> {
    const query = `
      INSERT INTO users (name, is_active)
      VALUES (?, ?)
    `;
    const result = await DatabaseService.executeQuery(query, [
      user.name,
      user.is_active,
    ]);
    return result.insertId;
  }

  async getUserById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = ?';
    const result = await DatabaseService.executeQuery(query, [id]);
    
    if (result.length > 0) {
      return result[0];
    }
    return null;
  }

  async getAllUsers(): Promise<User[]> {
    const query = 'SELECT * FROM users ORDER BY name ASC';
    const result = await DatabaseService.executeQuery(query);
    
    return result;
  }

  async getActiveUsers(): Promise<User[]> {
    const query = 'SELECT * FROM users WHERE is_active = 1 ORDER BY name ASC';
    const result = await DatabaseService.executeQuery(query);
    
    return result;
  }

  async updateUser(id: number, user: Partial<User>): Promise<boolean> {
    const fields = [];
    const values = [];
    
    if (user.name !== undefined) {
      fields.push('name = ?');
      values.push(user.name);
    }
    
    if (user.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(user.is_active);
    }
    
    if (fields.length === 0) return false;
    
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    
    const result = await DatabaseService.executeQuery(query, values);
    return result.rowsAffected > 0;
  }

  async deleteUser(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = ?';
    const result = await DatabaseService.executeQuery(query, [id]);
    return result.rowsAffected > 0;
  }

  async authenticateUser(name: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE name = ? AND is_active = 1';
    const result = await DatabaseService.executeQuery(query, [name]);
    
    if (result.length > 0) {
      return result[0];
    }
    return null;
  }
}