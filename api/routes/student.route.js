import express from 'express';
const router = express.Router();
import { protect, studentOnly } from '../middleware/auth.middleware.js';
import Enrollment from '../models/enrollment.model.js';
import Course from '../models/course.model.js';
import mongoose from 'mongoose';

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

      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
      });

      if (!enrollment)
        return res.status(404).json({ message: 'Enrollment not found' });

      if (!enrollment.completedModules.includes(moduleId)) {
        enrollment.completedModules.push(moduleId);

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
      res.status(500).json({ message: 'Failed to update progress' });
    }
  }
);

// Assignment Related API
router.get(
  '/courses/:courseId/modules/:moduleId/assignment-status',
  protect,
  studentOnly,
  async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;

      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
      });

      if (!enrollment) {
        return res.status(404).json({ message: 'Enrollment not found' });
      }

      const submitted = enrollment.assignments.some(
        a => a.module.toString() === moduleId
      );

      res.json({ submitted });
    } catch (err) {
      console.error('Assignment status error:', err);
      res.status(500).json({ message: 'Failed to fetch assignment status' });
    }
  }
);
router.post(
  '/courses/:courseId/modules/:moduleId/assignment',
  protect,
  studentOnly,
  async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;
      const { answer } = req.body;

      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
      });

      if (!enrollment)
        return res.status(404).json({ message: 'Enrollment not found' });

      if (!enrollment.assignments) enrollment.assignments = [];
      enrollment.assignments.push({
        module: moduleId,
        answer,
        submittedAt: new Date(),
      });

      await enrollment.save();

      res.json({ message: 'Assignment submitted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to submit assignment' });
    }
  }
);

// Quiz related API

router.post(
  '/courses/:courseId/modules/:moduleId/quiz',
  protect,
  studentOnly,
  async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;
      const { score } = req.body;

      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
      });

      if (!enrollment)
        return res.status(404).json({ message: 'Enrollment not found' });

      // Check if already submitted
      const already = enrollment.quizzes.find(
        q => q.module.toString() === moduleId
      );
      if (already) {
        return res.status(400).json({ message: 'Quiz already submitted' });
      }

      enrollment.quizzes.push({ module: moduleId, score });
      await enrollment.save();

      res.json({ message: 'Quiz submitted successfully', score });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to submit quiz' });
    }
  }
);

router.get(
  '/courses/:courseId/modules/:moduleId/quiz-status',
  protect,
  studentOnly,
  async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;

      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
      });

      if (!enrollment)
        return res.status(404).json({ message: 'Enrollment not found' });

      const quiz = enrollment.quizzes.find(
        q => q.module.toString() === moduleId
      );
      res.json({ submitted: !!quiz, score: quiz?.score || 0 });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch quiz status' });
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

      let enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
      }).populate('course');

      if (!enrollment) {
        return res.status(404).json({ message: 'Enrollment not found' });
      }

      res.json({ course: enrollment.course, enrollment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch course consumption' });
    }
  }
);

export default router;
