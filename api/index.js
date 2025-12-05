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
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
mongoose.connection.on('connected', () => console.log('MongoDB OK'));
mongoose.connection.on('error', err => console.log('MongoDB Error:', err));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Database Connected Successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);

app.use('/api', coursesRoutes);
app.use('/api', enrollmentRoutes);
app.listen(port, () => {
  console.log(`Course Master is Running on port ${port}`);
});
