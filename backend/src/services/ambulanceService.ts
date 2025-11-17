import db from '../database/database';
import { Ambulance, PaginationParams, PaginatedResponse, LocationQuery, SearchQuery } from '../types';
import { calculateDistance } from '../utils/distance';

export class AmbulanceService {
  getAll(params?: PaginationParams & LocationQuery & SearchQuery): PaginatedResponse<Ambulance> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM ambulances';
    const conditions: string[] = [];
    const queryParams: (string | number)[] = [];

    // Add search filter
    if (params?.search && params.search.trim()) {
      const searchTerm = `%${params.search.trim()}%`;
      conditions.push(
        '(title LIKE ? OR description LIKE ? OR location LIKE ? OR phone LIKE ?)'
      );
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
    query += ' ORDER BY createdAt DESC';
    query += ` LIMIT ? OFFSET ?`;

    queryParams.push(limit, offset);

    const ambulances = db.prepare(query).all(...queryParams) as Ambulance[];
    
    // Get total count with same search filter
    let countQuery = 'SELECT COUNT(*) as count FROM ambulances';
    const countParams: (string | number)[] = [];
    if (params?.search && params.search.trim()) {
      const searchTerm = `%${params.search.trim()}%`;
      countQuery += ' WHERE (title LIKE ? OR description LIKE ? OR location LIKE ? OR phone LIKE ?)';
      countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    const total = db.prepare(countQuery).get(...countParams) as { count: number };

    let filteredAmbulances = ambulances;

    // Filter by radius if location is provided
    if (params?.latitude !== undefined && params?.longitude !== undefined) {
      const latitude = params.latitude;
      const longitude = params.longitude;
      const radius = params.radius || 50; // Default 50km radius
      
      filteredAmbulances = ambulances.filter((ambulance) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          ambulance.latitude,
          ambulance.longitude
        );
        return distance <= radius;
      });

      // Re-sort by distance
      filteredAmbulances.sort((a, b) => {
        const distA = calculateDistance(
          latitude,
          longitude,
          a.latitude,
          a.longitude
        );
        const distB = calculateDistance(
          latitude,
          longitude,
          b.latitude,
          b.longitude
        );
        return distA - distB;
      });
    }

    return {
      data: filteredAmbulances,
      total: total.count,
      page,
      limit,
      totalPages: Math.ceil(total.count / limit),
    };
  }

  getById(id: number): Ambulance | null {
    const ambulance = db
      .prepare('SELECT * FROM ambulances WHERE id = ?')
      .get(id) as Ambulance | undefined;
    return ambulance || null;
  }

  create(ambulance: Omit<Ambulance, 'id' | 'createdAt' | 'updatedAt'>): Ambulance {
    const stmt = db.prepare(`
      INSERT INTO ambulances (title, description, location, latitude, longitude, image, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      ambulance.title,
      ambulance.description,
      ambulance.location,
      ambulance.latitude,
      ambulance.longitude,
      ambulance.image || null,
      ambulance.phone || null
    );

    const created = this.getById(result.lastInsertRowid as number);
    if (!created) {
      throw new Error('Failed to create ambulance');
    }
    return created;
  }

  update(id: number, ambulance: Partial<Omit<Ambulance, 'id' | 'createdAt' | 'updatedAt'>>): Ambulance | null {
    const existing = this.getById(id);
    if (!existing) {
      return null;
    }

    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (ambulance.title !== undefined) {
      updates.push('title = ?');
      values.push(ambulance.title);
    }
    if (ambulance.description !== undefined) {
      updates.push('description = ?');
      values.push(ambulance.description);
    }
    if (ambulance.location !== undefined) {
      updates.push('location = ?');
      values.push(ambulance.location);
    }
    if (ambulance.latitude !== undefined) {
      updates.push('latitude = ?');
      values.push(ambulance.latitude);
    }
    if (ambulance.longitude !== undefined) {
      updates.push('longitude = ?');
      values.push(ambulance.longitude);
    }
    if (ambulance.image !== undefined) {
      updates.push('image = ?');
      values.push(ambulance.image);
    }
    if (ambulance.phone !== undefined) {
      updates.push('phone = ?');
      values.push(ambulance.phone);
    }

    if (updates.length === 0) {
      return existing;
    }

    values.push(id);
    const stmt = db.prepare(`UPDATE ambulances SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.getById(id);
  }

  delete(id: number): boolean {
    const existing = this.getById(id);
    if (!existing) {
      return false;
    }

    const stmt = db.prepare('DELETE FROM ambulances WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export default new AmbulanceService();

