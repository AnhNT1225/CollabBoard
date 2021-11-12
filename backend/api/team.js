const express = require("express");
const router = express.Router();
const { permit } = require("../middleware/permissionRole");
const teamController = require("../controllers/TeamController");
//CRUD
//route for create new team (user)
router.post("/create", permit("user"), teamController.createTeam);

//router for get all Team
router.get("/all", permit("admin"), teamController.getAllTeams);
//router for get all Team
router.get("/new", permit("admin"), teamController.findNewTeams);
//router for get top team
router.get("/top5", permit("admin"), teamController.getMaxBoardsTeams);

//router for get joined Team
router.get("/joined", permit("user"), teamController.getJoinedTeams);

//route for get detail team
router.get("/:teamId", permit("user"), teamController.getDetails);

// //router for add selected board to Team
// router.patch("/update/:id", permit('user'), teamController.addBoardToTeam);

//router for delete Team by id
router.delete("/delete/:id", permit("user"), teamController.deleteTeam);
//router for update Team by id
router.patch("/update/name/:id", permit("user"), teamController.updateTeamName);
//router for update Team boards by id
router.patch("/update/boards/:id", permit("user"), teamController.addBoardToTeam);

//router for update Team spaces by id
router.patch("/update/spaces/:id", permit("user"), teamController.addSpaceToTeam);
//router for remove selected space to team
router.patch("/remove/spaces/:id", permit("user"), teamController.removeSpaceFromTeam);
//router for remove selected members to team
router.patch("/remove/members/:id", permit("user"), teamController.removeMemberFromTeam);

//router for update Team spaces by id
router.patch("/update/members/:id", permit("user"), teamController.addMemberToTeam);

module.exports = router;
