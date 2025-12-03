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
    const courseData = req.body;

    const instructor = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    };

    const newCourse = new Course({
      ...courseData,
      instructor,
    });
    await newCourse.save();

    res
      .status(201)
      .json({ message: 'Course created successfully!', course: newCourse });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Failed to create course', error: error.message });
  }
});

export default router;
