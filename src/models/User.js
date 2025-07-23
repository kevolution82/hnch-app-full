const mongoose = require('mongoose'); // get mongoose for database
const bcrypt = require('bcryptjs'); // get bcrypt for password hashing

// make a user schema, this is like a blueprint for users
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true }, // user's full name
  email: { type: String, required: true, unique: true }, // user's email, must be unique
  password: { type: String, required: true }, // user's password
  avatarUrl: { type: String }, // user's avatar picture
  aliases: [{ type: String }] // other names user might use
});

// before saving, hash the password so it's safe
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // only hash if password changed
  this.password = await bcrypt.hash(this.password, 10); // hash password
  next(); // keep going
});

// method to check if password is correct
UserSchema.methods.verifyPassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password); // compare passwords
};

module.exports = mongoose.model('User', UserSchema); // export the user model