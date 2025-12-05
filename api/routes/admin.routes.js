import express from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import Course from '../models/course.model.js';

import User from '../models/user.model.js';

import Enrollment from '../models/enrollment.model.js';
const router = express.Router();

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

router.get('/course/:id/enrollments', async (req, res) => {
  try {
    const { id } = req.params;
    const enrollments = await Enrollment.find({ course: id })
      .populate('student', 'name email')
      .populate('course', 'title');

    res.json({ enrollments });
  } catch (err) {
    res.status(500).json({ message: 'Unable to load enrollments' });
  }
});

router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    // Count of running batches
    const courses = await Course.find();
    let totalRunningBatches = 0;
    courses.forEach(course => {
      if (course.batches) {
        totalRunningBatches += course.batches.filter(
          b => b.status === 'ongoing'
        ).length;
      }
    });

    res.json({
      totalStudents,
      totalCourses,
      totalEnrollments,
      totalRunningBatches,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

router.get('/enrollments', protect, adminOnly, async (req, res) => {
  try {
    const { courseId, batch } = req.query;
    const filter = {};

    if (courseId) filter.course = courseId;
    if (batch) filter.batch = { $regex: batch, $options: 'i' };

    const enrollments = await Enrollment.find(filter)
      .populate('student', 'name email')
      .populate('course', 'title');

    res.json({ enrollments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch enrollments' });
  }
});

router.get('/assignments/submissions', protect, adminOnly, async (req, res) => {
  try {
    const { courseId, batch, student } = req.query;

    const filter = {};
    if (courseId) filter.course = courseId;
    if (batch) filter.batch = { $regex: batch, $options: 'i' };

    // Find students matching search if student filter is provided
    let studentIds = [];
    if (student) {
      const users = await User.find({
        $or: [
          { name: { $regex: student, $options: 'i' } },
          { email: { $regex: student, $options: 'i' } },
        ],
      }).select('_id');

      studentIds = users.map(u => u._id);
      filter.student = { $in: studentIds };
    }

    // Get enrollments that match the filter
    const enrollments = await Enrollment.find(filter)
      .populate('student', 'name email')
      .populate('course', 'title');

    // Flatten assignments from enrollments
    const submissions = enrollments.flatMap(enroll =>
      (enroll.assignments || []).map(a => ({
        _id: a._id,
        student: enroll.student,
        course: enroll.course,
        batch: enroll.batch,
        submittedAt: a.submittedAt,
        answer: a.answer,
      }))
    );

    res.json({ submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
});
export default router;
