require("dotenv").config();
const express = require("express");
const app = express();
// const logger = require("morgan");
const http = require("http");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000" || "*",
    // origin: process.env.CLIENT_URL || "*",
    credentials: true,
  },
});
const registerBoardHandlers = require("./socketHandler/boardHandler");
// const dbConfig = require("./config/db.config");
// const bodyParse = require("body-parser");

const route = require("./api");
app.use(express.static(path.join(__dirname, "/public")));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyparser.json()); //utilizes the body-parser package
// parse requests of content-type - application/x-www-form-urlencoded

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//tracking development environment
// app.use(logger("dev"));
//useCookie
// app.use(cookieParser());
// parse requests of content-type - application/json
app.use(express.json({ limit: "50mb" }));
// app.use(express.json({limit: '50mb'})); // add limit size of upload file
//Using cross origin resource to avoid same security source
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

//Route init
route(app);

// const boardNamespace = io.of("/users");  //create io namespace which is an instance of socket io ('/')
//

//Socket.io ---- send realtime data to server

// const onConnection = (socket) => {
// 	registerBoardHandlers(io, socket);
// };
// io.on("connection", onConnection);

// io.setMaxListeners(0);

io.use(async (socket, next) => {
  // console.log("socket handshake: ", socket.handshake);
  try {
    const token = await socket.handshake.auth.token;
    const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.userId = await payload._id;
    next();
  } catch (error) {
    console.log("error socket: ", error);
  }
});
onlineUsers = [];

const addNewUser = (userId, socketId) => {
  onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", function (socket) {
  console.log("New client connected " + socket.userId);
  socket.on("newUser", (userId) => {
    addNewUser(userId, socket.id);
    console.log("online user: ", onlineUsers);
  });
  // console.log("socket room: ", socket.rooms);
  // console.log("al room: ", io.sockets.adapter.rooms);
  socket.on("ping", (count) => {
    console.log(count);
  });

  const joinRoom = (boardCode, memberInfo) => {
    console.log("room code: ", boardCode);
    // console.log("code confirm: ", io.sockets.adapter.rooms.has(boardCode));
    if (io.sockets.adapter.rooms.has(boardCode)) {
      socket.join(boardCode);
      console.log("user joined room: ", boardCode);
      console.log("all room in Join: ", io.of("/").adapter.rooms);
      socket.emit("notification", `You have joined the room: ${boardCode}`);
      socket.to(boardCode).emit("getRoomNotification", {
        memberName: memberInfo.memberName,
        message: `One people has name ${memberInfo.memberName} joined our board.`,
        type: memberInfo.type,
      });
    } else {
      console.log("There is no room like this key word search");
    }
  };

  const createRoom = (boardCode) => {
    console.log("THIS IS ROOM CODE: ", boardCode);
    if (boardCode !== null) {
      socket.join(boardCode);
      console.log("all room in create: ", io.sockets.adapter.rooms);
      // socket.emit("notification", `You have joined the room: ${boardCode}`);
    }
  };

  const leaveRoom = (boardCode) => {
    console.log("code confirm: ", io.sockets.adapter.rooms.has(boardCode));
    console.log("all room after leave: ", io.sockets.adapter.rooms);
    if (io.sockets.adapter.rooms.has(boardCode)) {
      socket.leave(boardCode);
      socket.emit("notification", `You have leave the room: ${boardCode}`);
    }
  };
  socket.on("join-room", joinRoom);
  socket.on("create-room", createRoom);
  socket.on("leave-room", leaveRoom);
  socket.on("drawLine", (data) => {
    console.log("data drawing: ", data);
    socket.in(data.code).emit("line", data.line);
  });

  socket.on("drawShape", (data) => {
    console.log("shapeData: ", data);
    socket.in(data.code).emit("shape", data.shapes);
  });

  socket.on("drawRect", (data) => {
    console.log("shapeData: ", data);
    socket.in(data.code).emit("receiveRect", data.rects);
  });
  socket.on("drawPoly", (data) => {
    console.log("shapeData: ", data);
    socket.in(data.code).emit("receivePoly", data.polys);
  });
  socket.on("drawElip", (data) => {
    console.log("shapeData: ", data);
    socket.in(data.code).emit("receiveElip", data.elips);
  });
  socket.on("drawStar", (data) => {
    console.log("shapeData: ", data);
    socket.in(data.code).emit("receiveStar", data.stars);
  });

  socket.on("drawText", (data) => {
    console.log("textData: ", data);
    socket.in(data.code).emit("text", data.text);
  });

  socket.on("drawNote", (data) => {
    console.log("noteData: ", data);
    socket.in(data.code).emit("note", data.notes);
  });

  socket.on("drawFile", (data) => {
    socket.in(data.code).emit("file", data.files);
  });

  //------------------SOCKET HANDLE DELETE---------------
  socket.on("deleteLine", (data) => {
    socket.in(data.code).emit("handleLineDelete", data.line);
  });
  socket.on("deleteShape", (data) => {
    socket.in(data.code).emit("handleShapeDelete", data.shape);
  });
  socket.on("deleteText", (data) => {
    socket.in(data.code).emit("handleTextDelete", data.text);
  });
  socket.on("deleteFile", (data) => {
    socket.in(data.code).emit("handleFileDelete", data.file);
  });
  //--------------SOCKET HANDLE MESSAGE----------------
  socket.on("sendMessageClient", function (data) {
    console.log(data);
    socket
      .in(data.code)
      .emit("receiveMessageServer", { message: data.message });
    socket.to(data.code).emit("getRoomNotification", {
      memberName: data.message.senderId.name,
      message: `${data.message.senderId.name} has sent a new message.`,
      type: 2,
    });
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected!: " + socket.userId);
    removeUser(socket.id);
  });
});

//DB connection
const db = require("./models");
const { da } = require("date-fns/locale");

db.mongoose
  .connect(
    // `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}` ||
    `${process.env.MONGODB_URI}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// set port, listen for requests
const PORT = process.env.PORT || 5000;

server.listen(5000, () => {
  console.log(`Server is running on port ${PORT}.`);
});
