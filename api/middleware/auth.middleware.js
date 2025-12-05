import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Verify Login
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log('[DEBUG] Incoming Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // console.log('[DEBUG] Missing or bad header');
      return res.status(401).json({ message: 'Not authorized!' });
    }

    const token = authHeader.split(' ')[1];
    // console.log('[DEBUG] Extracted token:', token);

    if (!token) {
      return res.status(401).json({ message: 'Not authorized!' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('[DEBUG] Decoded token:', decoded);
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Role Based Access
export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only!' });
  }
  next();
};

export const studentOnly = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Student access only!' });
  }
  // console.log('[DEBUG] User role:', req.user.role);
  next();
};
