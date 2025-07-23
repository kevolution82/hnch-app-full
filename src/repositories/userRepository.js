const UserModel = require('../models/User');

// get user by id
exports.getById = id => UserModel.findById(id);

// get user by email
exports.getByEmail = email => UserModel.findOne({ email });

// create new user
exports.create = userData => UserModel.create(userData);

// update user by id
exports.updateById = (id, update) => UserModel.findByIdAndUpdate(id, update, { new: true });

// delete user by id
exports.deleteById = id => UserModel.findByIdAndDelete(id);