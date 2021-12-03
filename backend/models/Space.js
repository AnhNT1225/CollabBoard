const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const spaceSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		createdBy: { type: Schema.Types.ObjectId, ref: "User" },
		members: [{ type: Schema.Types.ObjectId, ref: "User" }],
		teamId: { type: Schema.Types.ObjectId, ref: "Team"},
		boards: [{ type: Schema.Types.ObjectId, ref: "Board" }],
		// status: { type: String, enum:['Joined', 'Owned'], default: "Joined" },
	},
	{
		timestamps: true,
	}
);

const Space = mongoose.model("Space", spaceSchema);
module.exports = Space;
