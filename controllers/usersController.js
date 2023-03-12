const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const message = require('../models/imageModel');
const player = require('../models/playerModel');

// get all users
// route GET /users
// access Private

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean();
  if (!users?.length) {
    return res.status(400).json({ Message: 'no users found' });
  }
  res.json(users);
});

// Create User
// route POST /users
// access Private

const createNewUser = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  // check for username and password
  if (!userName || !password) {
    return res.status(400).json({ Message: 'All fields are Required' });
  }

  // check for duplicate user
  const duplicate = await User.findOne({ userName }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ Message: 'Duplicate User' });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  const userObj = { userName, password: hashedPassword };

  const user = await User.create(userObj);

  if (user) {
    res.status(201).json({ Message: `new user ${userName} was created` });
  } else {
    res.status(400).json({ Message: 'invalid user date received. try again' });
  }
});

// update User data
// route PATCH /users
// access Private

const updateUser = asyncHandler(async (req, res) => {
  const {
    id, userName, password, images, players, drafts,
  } = req.body;
  // check data
  if (!id || !userName) {
    return res.status(400).json({ Message: 'all fields are required' });
  }

  const user = await User.findById(id).exec();

  // check for user

  if (!user) {
    return res.status(400).json({ Message: 'user not found' });
  }

  // check for duplicates

  const duplicate = await User.findOne({ userName }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res
      .status(409)
      .json({ Message: 'duplicate username. please choose a different one' });
  }

  user.userName = userName;

  if (password) {
    user.password = await bcrypt.hash(password, 12);
  }


  const updatedUser = await user.save();

  res.json({ Message: 'Updated User Successfully' });
});
// Delete User
// route DELETE /users
// access Private

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ Message: 'user id required' });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ Message: 'User not found' });
  }
  const result = await user.deleteOne();

  const replyMessage = `UserName ${result.userName} with ${result._id} deleted`;

  res.json(replyMessage);
});

module.exports = {
  getAllUsers, createNewUser, updateUser, deleteUser,
};
