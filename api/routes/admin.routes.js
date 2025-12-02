import express from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin Route
router.get('/dashboard', protect, adminOnly, (req, res) => {
  res.json({
    message: 'Welcome Admin! This is your dashboard.',
    user: req.user,
  });
});

router.post('/create-course', protect, adminOnly, (req, res) => {
  res.json({
    message: 'Course created successfully!',
  });
});

export default router;
