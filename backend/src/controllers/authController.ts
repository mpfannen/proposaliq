import { Request, Response } from 'express';
import https from 'https';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import pool from '../config/database';
import { sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail } from '../services/emailService';

/**
 * Verifies a reCAPTCHA v3 token with Google's siteverify API.
 * Returns true if the token passes (score >= 0.5) or if RECAPTCHA_SECRET_KEY is not set.
 * Fails open on Google API errors to prevent legitimate users being blocked.
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn('⚠️  RECAPTCHA_SECRET_KEY not set — skipping bot check');
    return true;
  }

  return new Promise((resolve) => {
    const postData = `secret=${secret}&response=${token}`;
    const options = {
      hostname: 'www.google.com',
      path: '/recaptcha/api/siteverify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          const passed = result.success === true && (result.score ?? 0) >= 0.5;
          if (!passed) {
            console.warn('⚠️  reCAPTCHA failed — success:', result.success, 'score:', result.score);
          }
          resolve(passed);
        } catch {
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ reCAPTCHA request error:', err.message);
      // Fail open so a Google outage doesn't block all registrations
      resolve(true);
    });
    req.write(postData);
    req.end();
  });
}

/**
 * Generates a signed JWT for the given user ID.
 * Expiry is controlled by the JWT_EXPIRE env var (default: 7d).
 */
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
    const { email, password, name, recaptchaToken } = req.body;

    // Validate input
    if (!email || !password || !name) {
      console.log('❌ Missing required fields');
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    // Verify reCAPTCHA token (skipped if RECAPTCHA_SECRET_KEY is not set)
    if (recaptchaToken) {
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        console.log('❌ reCAPTCHA check failed — possible bot');
        res.status(400).json({ message: 'Bot detection check failed. Please try again.' });
        return;
      }
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

    // Send welcome email — fire-and-forget so it never blocks registration
    sendWelcomeEmail(user.email, user.name).catch((err) =>
      console.error('❌ Failed to send welcome email:', err)
    );

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

// @desc    Send password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const user = await UserModel.findByEmail(email);

    // Always return success to prevent email enumeration
    if (!user) {
      res.status(200).json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
      return;
    }

    // Delete any existing tokens for this user
    await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [user.id]);

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    try {
      await sendPasswordResetEmail(user.email, token);
    } catch (emailError) {
      console.error('❌ Failed to send password reset email:', emailError);
      res.status(500).json({ success: false, message: 'Failed to send reset email. Please try again.' });
      return;
    }

    res.status(200).json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
  } catch (error: any) {
    console.error('❌ Forgot password error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      res.status(400).json({ message: 'Token and password are required' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    const result = await pool.query(
      'SELECT * FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ message: 'Invalid or expired reset link. Please request a new one.' });
      return;
    }

    const { user_id } = result.rows[0];
    await UserModel.updatePassword(user_id, password);
    await pool.query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);

    // Fire-and-forget confirmation email — failure doesn't block the response
    const resetUser = await UserModel.findById(user_id);
    if (resetUser?.email) {
      sendPasswordResetSuccessEmail(resetUser.email).catch((err) =>
        console.error('❌ Failed to send reset success email:', err)
      );
    }

    res.status(200).json({ success: true, message: 'Password has been reset successfully.' });
  } catch (error: any) {
    console.error('❌ Reset password error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
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
