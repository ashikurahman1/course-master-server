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

router.delete('/delete-course/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error', error);
    res
      .status(500)
      .json({ message: 'Failed to delete course', error: error.message });
  }
});

router.patch('/update-course/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const courseData = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: courseData },
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({
      message: 'Course updated successfully',
      course: updatedCourse,
    });
  } catch (error) {
    console.error('Update course error', error);
    res.status(500).json({
      message: 'Failed to update course',
      error: error.message,
    });
  }
});

export default router;
