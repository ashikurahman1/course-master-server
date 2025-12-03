import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import mongoose from 'mongoose';
import express from 'express';

import adminRoutes from './routes/admin.routes.js';
import studentRoutes from './routes/student.route.js';
import authRoutes from './routes/auth.routes.js';
import coursesRoutes from './routes/courses.routes.js';
import enrollmentRoutes from './routes/enrollment.route.js';
const app = express();
const port = 3000;

// midleware
app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.log(error);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api', coursesRoutes);
app.use('/api', enrollmentRoutes);
app.listen(port, () => {
  console.log(`Course Master is Running on port ${port}`);
});
