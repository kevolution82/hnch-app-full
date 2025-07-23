const express = require('express'); // get express
const router = express.Router(); // make a new router
const auth = require('../middleware/auth'); // get auth middleware.
const chatController = require('../controllers/chatController'); // get chat controller

// protected route, need to be logged in
router.post('/message', auth, chatController.sendMessage); // send a message to the ai

module.exports = router; // export the router