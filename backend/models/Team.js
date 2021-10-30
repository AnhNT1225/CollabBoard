const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		members: [{ type: Schema.Types.ObjectId, ref: "User" }],
		boards: [{ type: Schema.Types.ObjectId, ref: "Board" }],
		spaces: [{ type: Schema.Types.ObjectId, ref: "Space" }],
		conversationId: [{ type: Schema.Types.ObjectId, ref: "Message" }],
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{
		timestamps: true,
	}
);

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
