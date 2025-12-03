import express from 'express';
import Course from '../models/course.model.js';

const router = express.Router();

router.get('/courses', async (req, res) => {
  try {
    let {
      limit = 8,
      skip = 0,
      sort = 'price',
      order = 'esc',
      search = '',
      category,
    } = req.query;
    limit = parseInt(limit);
    skip = parseInt(skip);

    const pipeline = [];

    const match = {};

    if (search) {
      match.$or = [
        { title: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) {
      match.category = category;
    }

    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;
    pipeline.push({ $sort: sortObj });

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const courses = await Course.aggregate(pipeline);

    const total = await Course.countDocuments(match);

    res.send({ total, count: courses.length, courses });
  } catch (error) {
    res.send({ message: 'failed' });
  }
});

router.get('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ course });
  } catch (error) {
    console.error('Get course error', error);
    res
      .status(500)
      .json({ message: 'Failed to get course', error: error.message });
  }
});

router.get('/courses/featured', async (req, res) => {
  try {
    const featuredCourses = await Course.find()
      .sort({ createdAt: -1 })
      .limit(8);

    res.json({
      courses: featuredCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});
export default router;
