require("dotenv").config();
const express = require("express");
// const jwt = require("jsonwebtoken");
const router = express.Router();
const { checkDuplicatedEmail } = require("../middleware/verifySignUp");
const { permit } = require("../middleware/permissionRole");
const authController = require("../controllers/AuthControlller");
// OLD WAY
// const { authenticateToken } = require("../../middleware/verifyUser");

// router.post("/login", authenticateToken, (req, res) => {
// 	//Authen user
// 	const email = req.body.email;
// 	const password = req.body.password;
// 	const user = { email: email, password: password };

// 	const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
// 		expiresIn: "1h",
// 	});
// 	res.json({ accessToken: accessToken });
// });

router.post("/register", checkDuplicatedEmail, authController.signup);
router.post("/login", authController.login);
router.post("/google/login", authController.loginAPI);

router.put("forgot-password", permit("user"), authController.forgotPassword);
module.exports = router;
