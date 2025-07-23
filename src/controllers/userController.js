javascript
const UserModel = require('../models/User'); // get the user model
const jwt = require('jsonwebtoken'); // for making tokens
const bcrypt = require('bcryptjs'); // for password hashing

// signup a new user
exports.registerAccount = async (req, res) => {
  try {
    const { fullName, email, password } = req.body; // get info from request
    let existingUser = await UserModel.findOne({ email }); // check if user already exists
    if (existingUser) return res.status(400).json({ message: 'User already exists!' }); // if yes, send error

    const newUser = new UserModel({ fullName, email, password }); // make new user
    await newUser.save(); //  save user to database

    // make a token for the user
    const authToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token: authToken }); // send token back
  } catch (err) {
    res.status(500).json({ message: 'Server error!!!' }); // if something goes wrong
  }
};

// login an existing user
exports.authenticateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body; // get info from request
    const foundUser = await UserModel.findOne({ email: email || username }); // find user by email or username
    if (!foundUser) return res.status(400).json({ message: 'Invalid credentials' }); // if not found send error

    const passwordValid = await foundUser.comparePassword(password); // check password
    if (!passwordValid) return res.status(400).json({ message: 'Invalid credentials' }); // if wrong send error

    // make a token for the user
    const loginToken = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token: loginToken }); // send token back
  } catch (err) {
    res.status(500).json({ message: 'Server error' }); // if something goes wrong
  }
};

// get the logged in user's profile
exports.fetchProfile = async (req, res) => {
  try {
    const profileUser = await UserModel.findById(req.user.id).select('-password'); // find user but don't show password
    if (!profileUser) return res.status(404).json({ message: 'User not found' }); // if not found send error
    res.json(profileUser); // send user info back
  } catch (err) {
    res.status(500).json({ message: 'Server error' }); // if something goes wrong
  }
};

// update the user's email
exports.changeEmail = async (req, res) => {
  try {
    const { email } = req.body; // get new email from request
    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, { email }, { new: true }).select('-password'); // update email
    res.json(updatedUser); // send updated user info back
  } catch (err) {
    res.status(500).json({ message: 'Server error' }); // if something goes wrong
  }
};

// update the user's password
exports.changePassword = async (req, res) => {
  try {
    const { password } = req.body; // get new password from request
    const userToUpdate = await UserModel.findById(req.user.id); // find user
    userToUpdate.password = password; // set new password
    await userToUpdate.save(); // save user
    res.json({ message: 'Password updated' }); // send success message
  } catch (err) {
    res.status(500).json({ message: 'Server error' }); // if something goes wrong
  }
};

// create user
exports.createUser = async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'could not create user' });
  }
};

// read user
exports.getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'user not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'could not get user' });
  }
};

// update user
exports.updateUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'user not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'could not update user' });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'user not found' });
    res.json({ message: 'user deleted' });
  } catch (err) {
    res.status(500).json({ message: 'could not delete user' });
  }
};