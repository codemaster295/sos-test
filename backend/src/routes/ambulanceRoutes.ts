import { Router, Request, Response } from 'express';
import ambulanceService from '../services/ambulanceService';
import { Ambulance } from '../types';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all ambulances with pagination and optional location filter (public - users can view)
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

    const result = ambulanceService.getAll(params);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ambulances' });
  }
});

// Get ambulance by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const ambulance = ambulanceService.getById(id);

    if (!ambulance) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    res.json(ambulance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ambulance' });
  }
});

// Create new ambulance (admin only)
router.post('/', authenticate, authorize('admin'), (req: AuthRequest, res: Response) => {
  try {
    const ambulance: Omit<Ambulance, 'id' | 'createdAt' | 'updatedAt'> = req.body;

    // Validate required fields
    if (!ambulance.title || !ambulance.description || !ambulance.location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (ambulance.latitude === undefined || ambulance.longitude === undefined) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const created = ambulanceService.create(ambulance);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ambulance' });
  }
});

// Update ambulance (admin only)
router.put('/:id', authenticate, authorize('admin'), (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;

    const updated = ambulanceService.update(id, updates);

    if (!updated) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ambulance' });
  }
});

// Delete ambulance (admin only)
router.delete('/:id', authenticate, authorize('admin'), (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = ambulanceService.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ambulance' });
  }
});

export default router;

