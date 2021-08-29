import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = asyncHandler(async (req, res, next) => {
  if (req.cookies.token) {
    try {
      let token = req.cookies.token;

      const decoded = jwt.verify(token, process.env.JWT_TOKEN);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized token failed');
    }
  } else {
    res.status(401);
    throw new Error('No token found');
  }
});

export const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorised admin');
  }
});
