import express from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import Course from '../models/course.model.js';

const router = express.Router();

// Admin Route
router.get('/dashboard', protect, adminOnly, (req, res) => {
  res.json({
    message: 'Welcome Admin! This is your dashboard.',
    user: req.user,
  });
});

router.post('/create-course', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, price, duration, category, syllabus, image } =
      req.body;

    // Instructor is current logged-in user
    const instructor = req.user._id;

    const course = await Course.create({
      title,
      description,
      price,
      image,
      duration,
      category,
      syllabus,
      instructor,
    });

    res.status(201).json({ message: 'Course created successfully!', course });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Failed to create course', error: error.message });
  }
});

export default router;
