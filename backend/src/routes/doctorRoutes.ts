import { Router, Request, Response } from 'express';
import doctorService from '../services/doctorService';
import { Doctor } from '../types';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all doctors with pagination and optional location filter (public - users can view)
router.get('/', (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const latitude = req.query.latitude ? parseFloat(req.query.latitude as string) : undefined;
    const longitude = req.query.longitude ? parseFloat(req.query.longitude as string) : undefined;
    const radius = req.query.radius ? parseFloat(req.query.radius as string) : undefined;
    const search = req.query.search ? (req.query.search as string).trim() : undefined;

    const params: {
      page: number;
      limit: number;
      latitude?: number;
      longitude?: number;
      radius?: number;
      search?: string;
    } = {
      page,
      limit,
    };

    if (latitude !== undefined) params.latitude = latitude;
    if (longitude !== undefined) params.longitude = longitude;
    if (radius !== undefined) params.radius = radius;
    if (search !== undefined && search.length > 0) params.search = search;

    const result = doctorService.getAll(params);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// Get doctor by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const doctor = doctorService.getById(id);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
});

// Create new doctor (admin only)
router.post('/', authenticate, authorize('admin'), (req: AuthRequest, res: Response) => {
  try {
    const doctor: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'> = req.body;

    // Validate required fields
    if (!doctor.title || !doctor.description || !doctor.location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (doctor.latitude === undefined || doctor.longitude === undefined) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const created = doctorService.create(doctor);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create doctor' });
  }
});

// Update doctor (admin only)
router.put('/:id', authenticate, authorize('admin'), (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;

    const updated = doctorService.update(id, updates);

    if (!updated) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update doctor' });
  }
});

// Delete doctor (admin only)
router.delete('/:id', authenticate, authorize('admin'), (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = doctorService.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
});

export default router;

