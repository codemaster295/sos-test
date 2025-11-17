import ambulanceService from '../ambulanceService';
import db from '../../database/database';
import { Ambulance } from '../../types';

describe('AmbulanceService', () => {
  beforeEach(() => {
    // Clear ambulances table before each test
    db.prepare('DELETE FROM ambulances').run();
  });

  describe('create', () => {
    it('should create a new ambulance', () => {
      const ambulanceData: Omit<Ambulance, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Test Ambulance',
        description: 'Test Description',
        location: 'Test Location',
        latitude: 40.7128,
        longitude: -74.0060,
        phone: '123-456-7890',
      };

      const created = ambulanceService.create(ambulanceData);

      expect(created).toBeDefined();
      expect(created.id).toBeDefined();
      expect(created.title).toBe(ambulanceData.title);
      expect(created.description).toBe(ambulanceData.description);
      expect(created.location).toBe(ambulanceData.location);
    });
  });

  describe('getById', () => {
    it('should return ambulance by id', () => {
      const ambulanceData: Omit<Ambulance, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Test Ambulance',
        description: 'Test Description',
        location: 'Test Location',
        latitude: 40.7128,
        longitude: -74.0060,
      };

      const created = ambulanceService.create(ambulanceData);
      const found = ambulanceService.getById(created.id!);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent id', () => {
      const found = ambulanceService.getById(999);
      expect(found).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return paginated ambulances', () => {
      // Create multiple ambulances
      for (let i = 0; i < 15; i++) {
        ambulanceService.create({
          title: `Ambulance ${i}`,
          description: `Description ${i}`,
          location: `Location ${i}`,
          latitude: 40.7128 + i * 0.01,
          longitude: -74.0060 + i * 0.01,
        });
      }

      const result = ambulanceService.getAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(10);
      expect(result.total).toBe(15);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(2);
    });
  });

  describe('update', () => {
    it('should update ambulance', () => {
      const ambulanceData: Omit<Ambulance, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Test Ambulance',
        description: 'Test Description',
        location: 'Test Location',
        latitude: 40.7128,
        longitude: -74.0060,
      };

      const created = ambulanceService.create(ambulanceData);
      const updated = ambulanceService.update(created.id!, { title: 'Updated Title' });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.description).toBe(ambulanceData.description);
    });

    it('should return null for non-existent id', () => {
      const updated = ambulanceService.update(999, { title: 'Updated Title' });
      expect(updated).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete ambulance', () => {
      const ambulanceData: Omit<Ambulance, 'id' | 'createdAt' | 'updatedAt'> = {
        title: 'Test Ambulance',
        description: 'Test Description',
        location: 'Test Location',
        latitude: 40.7128,
        longitude: -74.0060,
      };

      const created = ambulanceService.create(ambulanceData);
      const deleted = ambulanceService.delete(created.id!);

      expect(deleted).toBe(true);
      const found = ambulanceService.getById(created.id!);
      expect(found).toBeNull();
    });

    it('should return false for non-existent id', () => {
      const deleted = ambulanceService.delete(999);
      expect(deleted).toBe(false);
    });
  });
});

