import doctorService from '../doctorService';
import db from '../../database/database';
import { Doctor } from '../../types';

describe('DoctorService', () => {
  beforeEach(() => {
    // Clear doctors table before each test
    db.prepare('DELETE FROM doctors').run();
  });

  describe('create', () => {
    it('should create a new doctor', () => {
      const doctorData: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Dr. Test',
        description: 'Test Description',
        location: 'Test Location',
        latitude: 40.7128,
        longitude: -74.0060,
        specialization: 'Cardiology',
        phone: '123-456-7890',
      };

      const created = doctorService.create(doctorData);

      expect(created).toBeDefined();
      expect(created.id).toBeDefined();
      expect(created.title).toBe(doctorData.title);
      expect(created.specialization).toBe(doctorData.specialization);
    });
  });

  describe('getById', () => {
    it('should return doctor by id', () => {
      const doctorData: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Dr. Test',
        description: 'Test Description',
        location: 'Test Location',
        latitude: 40.7128,
        longitude: -74.0060,
      };

      const created = doctorService.create(doctorData);
      const found = doctorService.getById(created.id!);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent id', () => {
      const found = doctorService.getById(999);
      expect(found).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return paginated doctors', () => {
      // Create multiple doctors
      for (let i = 0; i < 15; i++) {
        doctorService.create({
          title: `Dr. Test ${i}`,
          description: `Description ${i}`,
          location: `Location ${i}`,
          latitude: 40.7128 + i * 0.01,
          longitude: -74.0060 + i * 0.01,
        });
      }

      const result = doctorService.getAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(10);
      expect(result.total).toBe(15);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(2);
    });
  });

  describe('update', () => {
    it('should update doctor', () => {
      const doctorData: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Dr. Test',
        description: 'Test Description',
        location: 'Test Location',
        latitude: 40.7128,
        longitude: -74.0060,
      };

      const created = doctorService.create(doctorData);
      const updated = doctorService.update(created.id!, { title: 'Dr. Updated' });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Dr. Updated');
    });

    it('should return null for non-existent id', () => {
      const updated = doctorService.update(999, { title: 'Dr. Updated' });
      expect(updated).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete doctor', () => {
      const doctorData: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Dr. Test',
        description: 'Test Description',
        location: 'Test Location',
        latitude: 40.7128,
        longitude: -74.0060,
      };

      const created = doctorService.create(doctorData);
      const deleted = doctorService.delete(created.id!);

      expect(deleted).toBe(true);
      const found = doctorService.getById(created.id!);
      expect(found).toBeNull();
    });

    it('should return false for non-existent id', () => {
      const deleted = doctorService.delete(999);
      expect(deleted).toBe(false);
    });
  });
});

