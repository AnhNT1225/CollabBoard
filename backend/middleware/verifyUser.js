require("dotenv").config();
const db = require("../models");
const User = db.user;
const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;
// catch error for token expired
const catchError = (err, res) => {
	if (err instanceof TokenExpiredError) {
		return res.status(401).json({ message: "Your token has been expired!" });
	}

	// return res.sendStatus(401).send({ message: "Unauthorized!" });
};

const authenticateToken = (req, res, next) => {
	// console.log(req);
	const authHeader = req.headers.authorization;
	// console.log("authHeader: ", authHeader);
	const token = authHeader && authHeader.split(" ")[1];
	console.log('authHeader: ', authHeader);
	console.log('token: ', token)
	if (!token) {

		return res.status(403).json({ message: "No token provided! Please login" });
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
		if (err) {
			return catchError(err, res);
		}
		// console.log("user: ", user);
		const foundUser = await User.findById(user._id);
		if (!foundUser) {
			console.log("User not found");
		}
		req.user = foundUser;
		next();
	});
};

// Roles based access middlewares
// const isAdmin = (req, res, next) => {
// 	if (req.user.role !== "admin") {
// 		return res.status(403).send("Unauthorized Access");
// 	}
// 	next();
// };
module.exports = {
	isAuth: authenticateToken,
	// isAdmin: isAdmin,
};
