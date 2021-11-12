const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
	{
		boardId: {type: Schema.Types.ObjectId, ref: "Board"},
		senderId: { type: Schema.Types.ObjectId, ref: "User" },
		message: { type: String, required: true },
		// time: { type: Date, default: Date.now },	
	},
	{
		timestamps: true,
	}
);

messageSchema.post('save', async(mess, next) => {
	await mess.populate('senderId');
	console.log("the populate message: ", mess);
	return mess;
	next();
})
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
