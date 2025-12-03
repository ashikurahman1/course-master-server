import express from 'express';
import Enrollment from '../models/enrollment.model.js';
import { protect, studentOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/enroll', protect, studentOnly, async (req, res) => {
  try {
    const { studentId, courseId, batch } = req.body;

    const exists = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (exists) {
      return res.status(400).json({ message: 'Already enrolled!' });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      batch,
    });

    res.json({ message: 'Enrolled successfully', enrollment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to enroll' });
  }
});
export default router;
