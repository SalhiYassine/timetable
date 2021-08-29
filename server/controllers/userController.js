import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

// @desc    auth user and get a token
// @route   POST /api/users/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  const user = await User.findOne({ email });
  console.log(user);

  if (user && (await user.matchPassword(password))) {
    res.cookie('token', generateToken(user._id), {
      expires: new Date(Date.now() + 1 * 24 * 3600000), // 1 Day
      httpOnly: true, // Stops the client accessing the cookie
      secure: process.env.NODE_ENV !== 'development', // secure if in production mode
    });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});
// @desc    logout user
// @route   POST /api/users/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
  });
  res.json('Cookie cleared');
});

// @desc   register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    const newUser = await User.create({ name, email, password });
    if (newUser) {
      res.status(201);
      res.cookie('token', generateToken(user._id), {
        expires: new Date(Date.now() + 1 * 24 * 3600000), // 1 Day
        httpOnly: true, // Stops the client accessing the cookie
        secure: process.env.NODE_ENV !== 'development', // secure if in production mode
      });
      res.json({
        _id: newUser._id,
        name: newUser.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(401);
      throw new Error('Invalid user data');
    }
  } else {
    res.status(401);
    throw new Error('User already exists');
  }
});

// @desc   gets the user profile based on a valid token
// @route   GET /api/users/profile
// @access  Private

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('User not found');
  }
});
