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
    const token = socket.handshake.auth.token;
    const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.userId = await payload._id;
    next();
  } catch (error) {
    console.log("error socket: ", error);
  }
});
onlineUsers = [];
const addNewUser = (userId, socketId) => {
  !onlineUsers.push({ userId, socketId });
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
  });
  // console.log("socket room: ", socket.rooms);
  // console.log("al room: ", io.sockets.adapter.rooms);
  socket.on("ping", (count) => {
    console.log(count);
  });

  const joinRoom = (boardCode) => {
    console.log("room code: ", boardCode);
    console.log("code confirm: ", io.sockets.adapter.rooms.has(boardCode));
    if (io.sockets.adapter.rooms.has(boardCode)) {
      socket.join(boardCode);
      console.log("user joined room: ", boardCode);
      console.log("all room in Join: ", io.of("/").adapter.rooms);
      //Trả lại thông báo cho người vào phòng
      socket.emit("notification", `You have joined the room: ${boardCode}`);
      //Trả lại thông báo cho tất cả người còn lại trong phòng
      io.to(boardCode).emit(
        "notification",
        `One people has id ${socket.id} has joined our board.`
      );
      // socket.on("drawLine", (data) => {
      //   console.log("data drawing: ", data);
      //   io.to("b9a96a021a").broadcast.emit("line", data);
      // });
      // socket.on("drawShape", (shapeData) => {
      //   console.log("shapeData: ", shapeData);
      //   socket.to(boardCode).emit("shape", shapeData);
      // });
      // socket.on("drawText", (textData) => {
      //   console.log("shapeData: ", textData);
      //   socket.to(boardCode).emit("text", textData);
      // });
      // socket.on("sendMessageClient", (data) => {
      //   console.log(data);
      //   io.to(boardCode).emit("sendMessageServer", { data });
      // });
    } else {
      console.log("There is no room like this key word search");
    }
  };

  const createRoom = (boardCode) => {
    console.log("THIS IS ROOM CODE: ", boardCode);
    socket.join(boardCode);
    console.log("all room in create: ", io.sockets.adapter.rooms);
    socket.emit("notification", `You have joined the room: ${boardCode}`);
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
  socket.on("drawText", (data) => {
    console.log("textData: ", data);
    socket.in(data.code).emit("text", data.text);
  });

  socket.on("drawNote", (data) => {
    console.log("noteData: ", data);
    socket.in(data.code).emit("note", data.notes);
  });

  socket.on("drawFile", (data) => {
    // console.log("fileData: ", data);
    // data.files.forEach((element) => {
    //   const buffer = Buffer.from(element.src.split(",")[1], "base64");
    //   // console.log('buffer type: ', buffer)
    //   element.src = buffer;
    // });
    // console.log("fileData: ", data.files);
    socket.in(data.code).emit("file", data.files);
  });
  socket.on("sendMessageClient", function (data) {
    console.log(data);
    socket.in(data.code).emit("receiveMessageServer", { message: data.message });
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected!: " + socket.userId);
    removeUser(socket.id);
  });
});

//DB connection
const db = require("./models");

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
