import { Router, Request, Response } from 'express';
import userService from '../services/userService';
import { generateToken, verifyToken } from '../utils/jwt';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role }: RegisterRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Only allow user role registration, admin must be created manually or via special endpoint
    const userData: RegisterRequest = {
      email,
      password,
      name,
      role: role === 'admin' ? undefined : 'user', // Prevent admin self-registration
    };

    const user = await userService.create(userData);

    const token = generateToken({
      userId: user.id!,
      email: user.email,
      role: user.role,
    });

    const response: AuthResponse = {
      token,
      user: {
        id: user.id!,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    if (error instanceof Error && error.message === 'User with this email already exists') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await userService.validatePassword(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({
      userId: user.id!,
      email: user.email,
      role: user.role,
    });

    const response: AuthResponse = {
      token,
      user: {
        id: user.id!,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    const user = await userService.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

export default router;

