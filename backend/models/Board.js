const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardSchema = new Schema(
  {
    name: { type: String, trim: true, default: "Untitled" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    spaceId: {
      type: Schema.Types.ObjectId,
      ref: "Space",
    },
    teamId: { type: Schema.Types.ObjectId, ref: "Team"},
    contributors: [{ type: Schema.Types.ObjectId, ref: "User" }],

    code: { type: String, default: null },
    imageURL: {
      type: Buffer,
    },
    media: [
      {
        id: { type: String },
        x: { type: Number },
        y: { type: Number },
        src: { type: Buffer },
      },
    ],
    storage: {
      rectangles: [],
      polygons: [],
      ellipses: [],
      stars: [],
      texts: [],
      notes: [],
      lines: []
    },
    background: { type: String, default: '#ffffff' },
    createdAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now}
  },
  // { timestamp: true }
);

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
