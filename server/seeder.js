import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

import users from './data/users.js';

import User from './models/userModel.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    console.log('Data Imported'.green.inverse);
    process.exit(1);
  } catch (error) {
    console.log(`Data Could Not be Imported : ${error.message}`.red.inverse);
    process.exit(1);
  }
};
const destroytData = async () => {
  try {
    await User.deleteMany();
    console.log('Data Destroyed'.green.inverse);
    process.exit(1);
  } catch (error) {
    console.log(`Data Could Not be destroyed : ${error.message}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroytData();
} else {
  importData();
}
