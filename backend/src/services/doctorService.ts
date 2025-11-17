import db from '../database/database';
import { Doctor, PaginationParams, PaginatedResponse, LocationQuery, SearchQuery } from '../types';
import { calculateDistance } from '../utils/distance';

export class DoctorService {
  getAll(params?: PaginationParams & LocationQuery & SearchQuery): PaginatedResponse<Doctor> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM doctors';
    const conditions: string[] = [];
    const queryParams: (string | number)[] = [];

    // Add search filter
    if (params?.search && params.search.trim()) {
      const searchTerm = `%${params.search.trim()}%`;
      conditions.push(
        '(title LIKE ? OR description LIKE ? OR location LIKE ? OR phone LIKE ? OR specialization LIKE ?)'
      );
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
    query += ' ORDER BY createdAt DESC';
    query += ` LIMIT ? OFFSET ?`;

    queryParams.push(limit, offset);

    const doctors = db.prepare(query).all(...queryParams) as Doctor[];
    
    // Get total count with same search filter
    let countQuery = 'SELECT COUNT(*) as count FROM doctors';
    const countParams: (string | number)[] = [];
    if (params?.search && params.search.trim()) {
      const searchTerm = `%${params.search.trim()}%`;
      countQuery += ' WHERE (title LIKE ? OR description LIKE ? OR location LIKE ? OR phone LIKE ? OR specialization LIKE ?)';
      countParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }
    const total = db.prepare(countQuery).get(...countParams) as { count: number };

    let filteredDoctors = doctors;

    // Filter by radius if location is provided
    if (params?.latitude !== undefined && params?.longitude !== undefined) {
      const latitude = params.latitude;
      const longitude = params.longitude;
      const radius = params.radius || 50; // Default 50km radius
      
      filteredDoctors = doctors.filter((doctor) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          doctor.latitude,
          doctor.longitude
        );
        return distance <= radius;
      });

      // Re-sort by distance
      filteredDoctors.sort((a, b) => {
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
      data: filteredDoctors,
      total: total.count,
      page,
      limit,
      totalPages: Math.ceil(total.count / limit),
    };
  }

  getById(id: number): Doctor | null {
    const doctor = db
      .prepare('SELECT * FROM doctors WHERE id = ?')
      .get(id) as Doctor | undefined;
    return doctor || null;
  }

  create(doctor: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Doctor {
    const stmt = db.prepare(`
      INSERT INTO doctors (title, description, location, latitude, longitude, image, phone, specialization)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      doctor.title,
      doctor.description,
      doctor.location,
      doctor.latitude,
      doctor.longitude,
      doctor.image || null,
      doctor.phone || null,
      doctor.specialization || null
    );

    const created = this.getById(result.lastInsertRowid as number);
    if (!created) {
      throw new Error('Failed to create doctor');
    }
    return created;
  }

  update(id: number, doctor: Partial<Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>>): Doctor | null {
    const existing = this.getById(id);
    if (!existing) {
      return null;
    }

    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (doctor.title !== undefined) {
      updates.push('title = ?');
      values.push(doctor.title);
    }
    if (doctor.description !== undefined) {
      updates.push('description = ?');
      values.push(doctor.description);
    }
    if (doctor.location !== undefined) {
      updates.push('location = ?');
      values.push(doctor.location);
    }
    if (doctor.latitude !== undefined) {
      updates.push('latitude = ?');
      values.push(doctor.latitude);
    }
    if (doctor.longitude !== undefined) {
      updates.push('longitude = ?');
      values.push(doctor.longitude);
    }
    if (doctor.image !== undefined) {
      updates.push('image = ?');
      values.push(doctor.image);
    }
    if (doctor.phone !== undefined) {
      updates.push('phone = ?');
      values.push(doctor.phone);
    }
    if (doctor.specialization !== undefined) {
      updates.push('specialization = ?');
      values.push(doctor.specialization);
    }

    if (updates.length === 0) {
      return existing;
    }

    values.push(id);
    const stmt = db.prepare(`UPDATE doctors SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.getById(id);
  }

  delete(id: number): boolean {
    const existing = this.getById(id);
    if (!existing) {
      return false;
    }

    const stmt = db.prepare('DELETE FROM doctors WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export default new DoctorService();

