const express = require("express");
const router = express.Router();

const boardController = require("../controllers/BoardController");
const { permit } = require("../middleware/permissionRole");
//BoardController.index
// router.use("/", boardController.index);
// route for find board by searching board name
router.get("/", permit("user"), boardController.findBoardByCode);
//router for get all existed boards in system (admin) --> for manage and statistic
router.get("/all", permit("admin"), boardController.getAllBoards);
//router for get new boards that user created on one days
router.get("/new", permit("admin"),boardController.findNewBoards);

//router for get latest boards that user joined (not owned by user)
router.get("/lastest", permit("user"),boardController.getLastestBoards);
//router for get all boards that user joined (not owned by user)
router.get("/joined", permit("user"),boardController.getJoinedBoards);
//router for get all boards is created (by owned user)
router.get("/owned", permit("user"),boardController.getOwnedBoards);

//CRUD
//route for create new board (user)
router.post("/create", permit("user"), boardController.createBoard);
//route for get detail board
router.get("/:boardId", permit("user"), boardController.getDetails);

//route for update board name by id
router.patch("/update/name/:id", permit("user"), boardController.updateBoardName);
//route for update spaceId for board
router.patch("/update/space/:id", permit("user"), boardController.setSpaceForBoard)
//route for update board by id
router.patch("/update/canvas/:id", permit("user"), boardController.updateBoardCanvas);
//route for leave board by id
router.patch("/leave/:id", permit("user"), boardController.leaveBoard);

// route for delete board by id
router.delete("/delete/:id", permit("user"), boardController.deleteBoard);

//get board inside board contributors by id

// router.get("/:userId", async (req, res) => {
//     try {
//       const board = await Board.find({
//         contributors: { $in: [req.params.userId] },
//       });
//       res.status(200).json(board);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });




//GET current users on board
// router.get("/:id/users", isAuth, boardController.getContributors);
module.exports = router;
