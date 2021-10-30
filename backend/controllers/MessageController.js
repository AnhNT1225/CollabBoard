const Message = require("../models/Message");

class MessageController {
    async addNewMessage(req, res) {
        const newMessage = new Message({
            boardId: req.params.boardId,
            senderId: req.user._id,
            message: req.body.message,
        });
      
        try {
          const savedMessage = await newMessage.save();
          res.status(200).json(savedMessage);
        } catch (err) {
          res.status(500).json(err);
        }
      }

    async getMessages(req, res) {
        try {
          const messages = await Message.find({
              boardId: req.params.boardId,
          }).populate('senderId')
          res.status(200).json({sucess: 'true', data: messages});
        } catch (err) {
          res.status(500).json(err);
        }
      }
}
module.exports = new MessageController();
