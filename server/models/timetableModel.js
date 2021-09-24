import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Timetable = mongoose.Schema(
  {
    year: { type: Array, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model('Timetable', Timetable);

export default User;
