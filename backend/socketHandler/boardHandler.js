const Board = require("../models/Board");
const jwt = require("jsonwebtoken");

// const isValidJwt = (header) => {
// 	const token = header.split(" ")[1];
// 	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
// 		if (err) {
// 			return false;
// 		}
// 		if (!user) {
// 			return false;
// 		} else {
// 			return user;
// 		}
// 	});
// };
module.exports = (io, socket) => {
	const boardIo = io.of("/boards");
	// console.log("al room outside: ", io.sockets.adapter.rooms);
	// console.log("al id outside: ", io.sockets.adapter.sids);

	// io.use((socket, next) => {
	// 	const header = socket.handshake.headers["authorization"];
	// 	if (isValidJwt(header)) {
	// 		return next();
	// 	}
	// 	return next(new Error("authentication error"));
	// });

	// function getActiveRooms(io) {
	// 	// Convert map into 2D list:
	// 	// ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
	// 	const arr = Array.from(io.sockets.adapter.rooms);
	// 	// Filter rooms whose name exist in set:
	// 	// ==> [['room1', Set(2)], ['room2', Set(2)]]
	// 	const filtered = arr.filter((room) => !room[1].has(room[0]));
	// 	// Return only the room name:
	// 	// ==> ['room1', 'room2']
	// 	const res = filtered.map((i) => i[0]);
	// 	return res;
	// }

	const joinRoom = (socket, boardCode) => {
		console.log("yes/no: ", io.sockets.adapter.rooms.has(boardCode.toString()));
		if (io.sockets.adapter.rooms.has(boardCode)) {
			boardIo.join(boardCode);
			console.log("user joined room: ", boardCode);
			console.log("all room in Join: ", boardIo.rooms);
			//Trả lại thông báo cho người vào phòng
			socket.emit("notification", `You have joined the room: ${boardCode}`);
			//Trả lại thông báo cho tất cả người còn lại trong phòng
			io.to(boardCode).emit(
				"notification",
				`One people has id ${socket.id} has joined our board.`
			);
		} else {
			console.log("There is no room like this key word search");
		}
		// if (io.sockets.adapter.rooms.get(boardCode)) {
		// roomId = boardCode;
		// const activeRooms = getActiveRooms(io);
		// console.log("activeRoom: ", activeRooms);
		// activeRooms.forEach((element) => {
		// 	if (element === boardCode) {
		// 		socket.join(boardCode);
		// 		console.log("user joined room: ", boardCode);
		// 		console.log("all room: ", socket.rooms);
		// 		//Trả lại thông báo cho người vào phòng
		// 		socket.emit("notification", `You have joined the room: ${boardCode}`);
		// 		//Trả lại thông báo cho tất cả người còn lại trong phòng
		// 		io.to(boardCode).emit(
		// 			"notification",
		// 			`One people has id ${socket.id} has joined our board.`
		// 		);
		// 	}
		// 	console.log("There is no room like this key word search");
		// });
	};

	const createRoom = (boardCode) => {
		console.log("THIS IS ROOM CODE: ", boardCode);
		socket.join(boardCode);
		console.log("all room in create: ", io.sockets.adapter.rooms);
		boardIo.emit("notification", `You have joined the room: ${boardCode}`);
	};
	boardIo.on("connection", (socket) => {
		//Welcome new joiners!
		socket.emit("welcome", "This is the Board Channel!");
		// console.log("socket id: ", socket.id);
	});
	boardIo.on("join-room", joinRoom);
	boardIo.on("create-room", createRoom);
	// socket.on("drawLine", (data) => {
	// 	console.log("data drawing: ", data);
	// 	socket.broadcast.emit("line", data);
	// });
	// socket.on("drawShape", (shapeData) => {
	// 	console.log("shapeData: ", shapeData);
	// 	socket.broadcast.emit("shape", shapeData);
	// });
	// socket.on("drawText", (textData) => {
	// 	console.log("shapeData: ", textData);
	// 	socket.broadcast.emit("text", textData);
	// });
	// socket.on("disconnect", () => {
	// 	console.log("Client disconnected!");
	// });
};
