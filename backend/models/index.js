const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./User");
db.board = require("./Board");
db.space = require("./Space");
// db.role = require("./Role");

// db.ROLES = ["host", "admin", "user"];
// console.log(db);
module.exports = db;
