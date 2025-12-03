import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    batch: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Enrollment', enrollmentSchema);
