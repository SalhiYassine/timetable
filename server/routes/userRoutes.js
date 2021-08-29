import express from 'express';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import {
  authUser,
  getUserProfile,
  logout,
  registerUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser);
router.post('/login', authUser);
router.route('/logout').get(logout);
router.route('/profile').get(protect, getUserProfile);

export default router;
