require("dotenv").config();
const jwt = require("jsonwebtoken");

const db = require("../models");
const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
	let token = req.headers["x-access-token"];
	// If the token is not existed, throw 401 error
	if (!token) {
		return res.status(403).send({ message: "No token provided! Please login" });
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
		if (err) {
			return res.status(401).send({ message: "Unauthorized!" });
		}
		req.userId = decoded._id;
		// const foundUser = await User.findById(userId);
		// if (!foundUser) {
		// 	console.log("User not found");
		// }
		// req.user = foundUser;
		next();
	});
};

// isAdmin = (req, res, next) => {
// 	User.findById(req.userId).exec((err, user) => {
// 		if (err) {
// 			res.status(500).send({ message: err });
// 			return;
// 		}

// 		Role.find(
// 			{
// 				_id: { $in: user.roles },
// 			},
// 			(err, roles) => {
// 				if (err) {
// 					res.status(500).send({ message: err });
// 					return;
// 				}

// 				for (let i = 0; i < roles.length; i++) {
// 					if (roles[i].name === "admin") {
// 						next();
// 						return;
// 					}
// 				}

// 				res.status(403).send({ message: "Require Admin Role!" });
// 				return;
// 			}
// 		);
// 	});
// };

// isHost = (req, res, next) => {
// 	User.findById(req.userId).exec((err, user) => {
// 		if (err) {
// 			res.status(500).send({ message: err });
// 			return;
// 		}

// 		Role.find(
// 			{
// 				_id: { $in: user.roles },
// 			},
// 			(err, roles) => {
// 				if (err) {
// 					res.status(500).send({ message: err });
// 					return;
// 				}

// 				for (let i = 0; i < roles.length; i++) {
// 					if (roles[i].name === "role") {
// 						next();
// 						return;
// 					}
// 				}

// 				res.status(403).send({ message: "Require Host Role!" });
// 				return;
// 			}
// 		);
// 	});
// };

const authJwt = {
	verifyToken: verifyToken,
	// isAdmin,
	// isHost
};
module.exports = authJwt;
