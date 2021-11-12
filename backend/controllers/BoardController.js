const Board = require("../models/Board");
const endOfDay = require("date-fns/endOfDay");
const startOfDay = require("date-fns/startOfDay");
const { genRandomCode } = require("../utils/genRandomCodeString");
const BLANK_BOARD =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASIAAADICAQAAADmHyRtAAABVUlEQVR42u3SMQEAAAgDINc/9Izg4QsZSDvwEomQCImQCCRCIiRCIpAIiZAIiUAiJEIiJAKJkAiJkAgkQiIkQiKQCImQCIlAIiRCIiQCiZAIiZAIJEIiJEIikAiJkAiJQCIkQiIkAomQCImQCCRCIiRCIpAIiZAIiUAiJEIiJAKJkAiJkAgkQiIkQiKQCImQCIlAIiRCIiQCiZAIiZAIJEIiJEIikAiJkAiJQCIkQiIkAomQCImQCCRCIiRCIpAIiZAIiUAiJEIiJAKJkAiJkAgkQiIkQiKQCImQCIlAIiRCIiSSCImQCIlAIiRCIiQCiZAIiZAIJEIiJEIikAiJkAiJQCIkQiIkAomQCImQCCRCIiRCIpAIiZAIiUAiJEIiJAKJkAiJkAgkQiIkQiKQCImQCIlAIiRCIiQCiZAIiZAIJEIiJEIikAiJkAiJQCIkQiIkgtsCPzePSLVEgrkAAAAASUVORK5CYII=";
class BoardController {
  //get all board in system
  async getAllBoards(req, res) {
    // const userId = req.user._id;
    await Board.find({})
      .populate("createdBy")
      .populate("spaceId")
      .then((boards) => {
        if (!boards)
          return res.status(404).json({
            success: false,
            message: "Board not found",
          });
        // console.log("test: ", boards);
        // boards.imageURL = fs.writeFile("./output.png", boards.imageURL);
        return res.status(200).json({
          success: true,
          data: boards,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(400)
          .json({ success: false, message: "Bad request!" });
      });
  }

  //get new boards that user created once day
  async findNewBoards(req, res) {
    try {
      const board = await Board.find({
        createdAt: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) },
      });
      if (!board) {
        return res
          .status(404)
          .json({ success: false, message: "New boards not found." });
      }
      console.log("board: ", board);
      return res.status(200).json({
        success: true,
        data: board,
      });
    } catch (error) {
      console.log("the catch error: ", error);
      return res.status(500).json({ success: false, message: "Bad request!" });
    }
  }

  //get lastest boards that user accessed
  async getLastestBoards(req, res) {
    // Querry for getting 4 latest documents
    await Board.find({ contributors: req.user._id })
      .sort({ _id: -1 })
      .limit(4)
      // .populate("createdBy")
      // .populate("spaceId")
      .then((boards) => {
        if (!boards)
          return res.status(404).json({
            success: false,
            message: "Board not found",
          });

        return res.status(200).json({
          success: true,
          data: boards,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(400)
          .json({ success: false, message: "Bad request!" });
      });
  }

  //get all board that user joined
  async getJoinedBoards(req, res) {
    console.log("req: ", req.user);
    await Board.find({ contributors: req.user._id })
      .populate("spaceId")
      .then((result) => {
        if (!result)
          return res.status(404).json({
            success: false,
            message: "Board not found",
          });
        res.status(200).json({
          success: true,
          data: result,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(400)
          .json({ success: false, message: "Bad request!" });
      });
  }
  //get the owned board that user created
  async getOwnedBoards(req, res) {
    await Board.find({ createdBy: req.user._id })
      .populate("createdBy", "_id firstName lastName")
      .populate("spaceId")
      .then((result) => {
        if (!result)
          return res.status(404).json({
            success: false,
            message: "Board not found",
          });
        res.status(200).json({
          success: true,
          data: result,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(400)
          .json({ success: false, message: "Bad request!" });
      });
  }
  //update board by id
  async updateBoardCanvas(req, res) {
    const { board_storage, board_src, board_media } = req.body;
    console.log("hehehe: ", JSON.parse(board_media));
    let mediaArr = JSON.parse(board_media);
    let newArr = [];
    for (const el of mediaArr) {
      // console.log("element: ", el.src);
      const allElement = { ...el };
      const bindata = Buffer.from(allElement.src.split(",")[1], "base64");
      // console.log("binData: ", bindata);
      allElement.src = bindata;
      newArr.push(allElement);
    }
    // console.log("newArr: ", newArr);
    const boardId = req.params.id;

    let boardData;
    // if (board_src && (board_store || board_media)) {
    const bindata = Buffer.from(board_src.split(",")[1], "base64");
    boardData = {
      imageURL: bindata,
      // storage: { a: board_storage.a, b: board_storage.b },
      storage: {
        rectangles: JSON.parse(board_storage.rectangles),
        polygons: JSON.parse(board_storage.polygons),
        ellipses: JSON.parse(board_storage.ellipses),
        stars: JSON.parse(board_storage.stars),
        notes: JSON.parse(board_storage.notes),
        lines: JSON.parse(board_storage.lines),
        texts: JSON.parse(board_storage.texts),
      },
      updatedAt: new Date(Date.now()).toISOString(),
      media: newArr,
    };
    // }

    await Board.findByIdAndUpdate({ _id: boardId }, boardData, {
      new: true,
    })
      .populate("contributors")
      .populate("createdBy")
      .populate("spaceId")
      .then(async (board) => {
        return res.status(200).json({
          success: true,
          message: "Update boards successful",
          data: board,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(500)
          .json({ success: false, message: "Bad request!" });
      });
  }

  async updateBoardName(req, res) {
    const boardId = req.params.id;
    const { board_name } = req.body;
    console.log("boardID If: ", boardId, "boardName: ", board_name);
    await Board.findByIdAndUpdate(
      { _id: boardId },
      { name: board_name, updatedAt: new Date(Date.now()).toISOString() },
      {
        new: true,
      }
    )
      .populate("contributors")
      .then((board) => {
        console.log("New board updated name: ", board);
        return res.status(200).json({
          success: true,
          message: "Update board name successful",
          data: board,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(500)
          .json({ success: false, message: "Bad request!" });
      });
  }

  //delete board by id
  async deleteBoard(req, res) {
    //Get board id through params on URL
    const boardId = req.params.id;
    await Board.findByIdAndDelete({ _id: boardId })
      .populate("spaceId")
      .then((board) => {
        // if(board.populated('spaceId') !== null){
        //   board.spaceId.delete
        // }
        return res.status(200).json({
          success: true,
          message: "Delete a board successful",
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(400)
          .json({ success: false, message: "Bad request!" });
      });
  }

  //get board info
  async getDetails(req, res) {
    const boardId = req.params.boardId;
    // console.log("test board Id: ", boardId);

    await Board.findById(boardId)
      .populate("contributors")
      .then((board) => {
        if (!board)
          return res.status(404).json({
            success: false,
            message: "Board not found",
          });
        // console.log("test: ", board);
        return res.status(200).json({
          success: true,
          data: board,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(400)
          .json({ success: false, message: "Bad request!" });
      });
  }

  //----------------------------------
  //SERVICE OF GET PATICIPANTS ON BOARDS EDITOR
  // getContributors(req, res) {
  // 	const {}
  // }

  async createBoard(req, res) {
    // const { boardCode } = req.body;
    const boardCode = await genRandomCode();
    const { boardName } = req.body;
    const bindata = Buffer.from(BLANK_BOARD.split(",")[1], "base64");

    const board = new Board({
      createdBy: req.user,
      code: boardCode,
      imageURL: bindata,
    });
    if (boardName) {
      board.name = boardName;
    }
    board.contributors.addToSet(req.user);
    // board.storage = { elements: null, medias: null };
    // board.markModified("storage");
    // space: space,
    // contributors: contributors,

    //This populates the author id with actual author information!

    board
      .save()
      .then((data) => {
        console.log("Board saved successfully!");
        return res.status(201).json({
          success: true,
          message: `New boards is created successfully`,
          board: data,
        });
      })
      .catch((err) => {
        console.log("Error: ", err);
        return res.status(400).json({
          success: false,
          message: err,
        });
      });
  }

  async findBoard(req, res) {
    const board_name = req.query;
    await Board.findOne({ name: board_name })
      .populate("spaceId")
      .then((board) => {
        if (!board)
          return res.status(404).json({
            success: false,
            message: "Boards not found",
          });
        return res.status(200).json({
          success: true,
          message: "Board is find successfull",
          data: board,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(400)
          .json({ success: false, message: "Bad request!" });
      });
  }

  async findBoardByCode(req, res) {
    const board_code = req.query.boardCode;
    console.log("board CODE: ", board_code);
    console.log("user: ", req.user);
    await Board.findOneAndUpdate(
      { code: board_code },
      { $addToSet: { contributors: req.user._id } }
    )
      .populate("spaceId")
      .then((board) => {
        if (!board) {
          return res.status(404).json({
            success: false,
            message: "Boards not found",
          });
        }
        return res.status(200).json({
          success: true,
          message: "Board is find successfull",
          data: board,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(400)
          .json({ success: false, message: "Bad request!" });
      });
  }

  //add spaceId for Board
  async setSpaceForBoard(req, res) {
    const boardId = req.params.id;
    const { spaceId } = req.body;
    Board.findByIdAndUpdate(
      { _id: boardId },
      { spaceId: spaceId },
      { new: true }
    )
      .populate("spaceId")
      .then((board) => {
        return res.status(200).json({
          success: true,
          message: "Assign successfully space for board",
          data: board,
        });
      })
      .catch((error) => {
        console.log("error: ", error);
        return res.status
          .code(400)
          .json({ success: false, message: "Bad request!" });
      });
  }
}

module.exports = new BoardController();
