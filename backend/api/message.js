const express = require("express");
const router = express.Router();
const messageController = require('../controllers/MessageController')
//add

router.post("/:boardId", messageController.addNewMessage);

//get

router.get("/:boardId", messageController.getMessages);

module.exports = router;