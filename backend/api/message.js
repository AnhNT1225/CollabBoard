const express = require("express");
const router = express.Router();
const messageController = require('../controllers/MessageController')
//add

router.post("/:boardId", messageController.addNewMessage);

//router delete message
router.delete('/:boardId', messageController.deleteMessages)
//get all messages by boardId

router.get("/:boardId", messageController.getMessages);

module.exports = router;