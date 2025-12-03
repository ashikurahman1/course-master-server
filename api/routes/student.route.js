import express from 'express';
import { protect, studentOnly } from '../middleware/auth.middleware.js';
import Enrollment from '../models/enrollment.model.js';
import Course from '../models/course.model.js';
const router = express.Router();

// Example Student Route
router.get('/profile', protect, studentOnly, (req, res) => {
  res.json({
    message: 'Welcome Student! This is your profile.',
    user: req.user,
  });
});

router.get('/my-courses', protect, studentOnly, async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id }).populate(
    'course'
  );
  res.json(enrollments);
});

router.post(
  '/courses/:courseId/modules/:moduleId/complete',
  protect,
  studentOnly,
  async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;
      const studentId = req.user._id;

      const enrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
      });
      if (!enrollment)
        return res.status(404).json({ message: 'Enrollment not found' });

      if (!enrollment.completedModules.includes(moduleId)) {
        enrollment.completedModules.push(moduleId);

        // update progress
        const course = await Course.findById(courseId);
        const totalModules = course.modules.length;
        enrollment.progress = Math.round(
          (enrollment.completedModules.length / totalModules) * 100
        );

        await enrollment.save();
      }

      res.json({
        message: 'Module marked completed',
        progress: enrollment.progress,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Failed to update progress' });
    }
  }
);

router.get(
  '/courses/:courseId/consumption',
  protect,
  studentOnly,
  async (req, res) => {
    try {
      const { courseId } = req.params;
      const studentId = req.user._id;

      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: 'Course not found' });

      const enrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
      });
      if (!enrollment)
        return res.status(404).json({ message: 'Enrollment not found' });

      res.json({ course, enrollment });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Failed to fetch course consumption' });
    }
  }
);
export default router;
