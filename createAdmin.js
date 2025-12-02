import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './api/models/user.model.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: 'admin@coursemaster.com',
    });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Bangladesh71', 10);

    // Create admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@coursemaster.com',
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://i.ibb.co/5GzXkwq/user.png',
    });

    console.log('Admin created successfully:', admin);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

createAdmin();
