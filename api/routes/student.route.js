import express from 'express';
import { protect, studentOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// Example Student Route
router.get('/profile', protect, studentOnly, (req, res) => {
  res.json({
    message: 'Welcome Student! This is your profile.',
    user: req.user,
  });
});

router.post('/enroll', protect, studentOnly, (req, res) => {
  res.json({
    message: 'Course enrollment successful!',
  });
});

export default router;
