import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';

// Generate JWT token
const generateToken = (userId: number): string => {
  const secret: string = process.env.JWT_SECRET || 'your-secret-key';
  const expiresIn: string = process.env.JWT_EXPIRE || '7d';

  return jwt.sign({ id: userId }, secret, { expiresIn } as jwt.SignOptions);
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  console.log('🔵 Registration request received:', { email: req.body.email, name: req.body.name });
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      console.log('❌ Missing required fields');
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: 'Please provide a valid email address' });
      return;
    }

    // Validate password length
    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long' });
      return;
    }

    // Check if user already exists
    const existingUser = await UserModel.emailExists(email);
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    // Create user
    const user = await UserModel.create({ email, password, name });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isPasswordValid = await UserModel.comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Update current user's profile (name/email)
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { name, email } = req.body;

    if (!name && !email) {
      res.status(400).json({ message: 'Provide name or email to update' });
      return;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Please provide a valid email address' });
        return;
      }
      // Check email isn't taken by another user
      const existing = await UserModel.findByEmail(email);
      if (existing && existing.id !== userId) {
        res.status(400).json({ message: 'Email already in use' });
        return;
      }
    }

    const updated = await UserModel.updateProfile(userId, { name, email });
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: { id: updated!.id, name: updated!.name, email: updated!.email } },
    });
  } catch (error: any) {
    console.error('❌ Update profile error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// @desc    Change current user's password
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Current and new password are required' });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ message: 'New password must be at least 6 characters' });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const fullUser = await UserModel.findByEmail(user.email);
    const valid = await UserModel.comparePassword(currentPassword, fullUser!.password);
    if (!valid) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    await UserModel.updatePassword(userId, newPassword);
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('❌ Update password error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update password' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // User ID is attached to request by auth middleware
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
