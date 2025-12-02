import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ['Programming', 'Design', 'Marketing', 'Business', 'Other'],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    syllabus: [
      {
        topic: { type: String, required: true },
        details: { type: String, required: true },
      },
    ],

    instructor: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: { type: String, required: true },
      email: { type: String, required: true },
      avatar: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;
