const express = require('express'); // get express
const router = express.Router(); // make a new router
const auth = require('../middleware/auth'); // get auth middleware
const userController = require('../controllers/userController'); // get user controller

// public routes, anyone can use these
router.post('/login', userController.authenticateUser); // login route
router.post('/signup', userController.registerAccount); // signup route

// protected routes, need to be logged in
router.get('/me', auth, userController.fetchProfile); // get your profile
router.put('/me/email', auth, userController.changeEmail); // update your email
router.post('/me/password', auth, userController.changePassword); // update your password

// create user
router.post('/', userController.createUser);
// read user
router.get('/:id', auth, userController.getUser);
// update user
router.put('/:id', auth, userController.updateUser);
// delete user
router.delete('/:id', auth, userController.deleteUser);

module.exports = router; // export router