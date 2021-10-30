const boardRouter = require("./board");
const authRouter = require("./auth");
const spaceRouter = require("./space");
const teamRouter = require("./team");
const userRouter = require("./user");
const messageRouter = require('./message');
const { isAuth } = require("../middleware/verifyUser");
function route(app) {
	// app.use("/auth", (req, res, next) => {
	// 	res.header({
	// 		"Access-Control-Allow-Origin": "*",
	// 		"Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE",
	// 		"Access-Control-Allow-Headers":
	// 			"X-Requested-With,content-type,Authorization, access_token",
	// 		"Access-Control-Expose-Headers":
	// 			"X-Requested-With,content-type, Authorization, access_token",
	// 	});

	// 	// 	res.header(
	// 	// 		"Access-Control-Allow-Headers",
	// 	// 		"Authorization, Origin, Content-Type, Accept"
	// 	// 	);
	// 	next();
	// });
	app.use("/api/auth", authRouter);
	app.use(isAuth);
	// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
	app.all("*", (req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Authorization"
		);
		next();
	});

	app.use("/api/board", boardRouter);
	app.use("/api/space", spaceRouter);
	app.use("/api/team", teamRouter);
	app.use("/api/user", userRouter);
	app.use("/api/messages", messageRouter);
}

module.exports = route;
