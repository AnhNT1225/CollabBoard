const Message = require("../models/Message");

class MessageController {
  async addNewMessage(req, res) {
    const newMessage = new Message({
      boardId: req.params.boardId,
      senderId: req.user._id,
      message: req.body.message,
    });


      // await newMessage.save().then((res)=> {
      //   res.populate({path: "senderId", select: "_id, name"}).execPopulate();
      //   console.log("the populate message: ", res);
      //   return res.status(200).json({ success: true, data: res });
      // }).catch(error => {
      //   return res.status(500).json({success: false, message: error});
      // })

    try {
      const savedMessage = await newMessage.save();
      console.log("saved message: ", savedMessage);
      res.status(200).json({ success: "true", data: savedMessage });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // async getMessageById(req, res){
  //   try {
  //     const message = await Message.findById({
  //       _id: req.params.messageId,
  //     }).populate("senderId")
  //     res.status(200).json({ success: "true", data: message });
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // }

  async getMessages(req, res) {
    try {
      const messages = await Message.find({
        boardId: req.params.boardId,
      }).populate("senderId");
      res.status(200).json({ success: "true", data: messages });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async deleteMessages(req, res) {
    try {
      const messages = await Message.deleteMany({
        boardId: req.params.boardId,
      });
      res.status(200).json({ success: "true", data: messages });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
module.exports = new MessageController();
