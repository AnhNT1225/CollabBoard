const express = require("express");
const router = express.Router();
const { permit } = require("../middleware/permissionRole");
const spaceController = require("../controllers/SpaceController");
//CRUD
//route for create new board (user)
router.post("/create", permit("user"), spaceController.createSpace);

//router for get joined space
router.get("/joined", permit("user"), spaceController.getJoinedSpaces);
router.get("/owned", permit("user"), spaceController.getOwnedSpaces); 


//route for update teamId for space
router.patch("/update/:id", permit("user"), spaceController.updateSpaceInfo)

//route for update teamId for space
router.patch("/update/team/:id", permit("user"), spaceController.setTeamForSpace)
//router for add selected board to space
router.patch("/update/boards/:id", permit("user"), spaceController.addBoardToSpace);
//router for remove selected board to space
router.patch("/remove/boards/:id", permit("user"), spaceController.removeBoardFromSpace);
//route for get detail space
router.get("/:spaceId", permit("user"), spaceController.getDetails);

//ruter for delete space by id
router.delete("/delete/:id", permit("user"), spaceController.deleteSpace);
module.exports = router;
