const { mongoose } = require("../models");
const Space = require("../models/Space");

const Team = require("../models/Team");
const User = require("../models/User");
// const Space = require('../models/Space');
class TeamController {
  createTeam(req, res) {
    const { teamName } = req.body;
    const team = new Team({
      name: teamName,
      createdBy: req.user._id,
    });
    team.members.addToSet(req.user);
    // space: space,
    // contributors: contributors,

    //This populates the user id with actual author information!
    team
      .save()
      .then((team) => {
        console.log("Team saved successfully!");
        return res.status(201).json({
          success: true,
          message: `Team ${team.name} is created successfully`,
          data: team,
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

  // GET ALL TEAMS (FOR ADMIN)
  async getAllTeams(req, res) {
    await Team.find({})
      .populate("members")
      .populate("conversationId")
      .populate("createdBy")
      .then((teams) => {
        if (!teams)
          return res.status(404).json({
            success: false,
            message: "Team not found",
          });
        // console.log("test: ", teams);
        // teams.imageURL = fs.writeFile("./output.png", teams.imageURL);
        return res.status(200).json({
          success: true,
          data: teams,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(400)
          .json({ success: false, message: "Bad request!" });
      });
  }

  // GET TEAMS HAS LARGEST BOARDS (FOR ADMIN)
  async getMaxBoardsTeams(req, res) {
    await Team.find({}).sort("-boards").limit(5)
      .populate("members")
      .populate("conversationId")
      .populate("createdBy")
      .then((teams) => {
        if (!teams)
          return res.status(404).json({
            success: false,
            message: "Team not found",
          });
        // console.log("test: ", teams);
        // teams.imageURL = fs.writeFile("./output.png", teams.imageURL);
        return res.status(200).json({
          success: true,
          data: teams,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(400)
          .json({ success: false, message: "Bad request!" });
      });
  }

  // GET ALL JOINED TEAM
  async getJoinedTeams(req, res) {
    await Team.find({ members: mongoose.Types.ObjectId(req.user._id) })
      .populate("members")
      .populate("conversationId")
      .populate("boards")
      .populate("spaces")
      .then((result) => {
        if (!result)
          return res.status(404).json({
            success: false,
            message: "Teams not found",
          });

        return res.status(200).json({
          success: true,
          data: result,
        });
      })
      .catch((error) => {
        console.log("error: ", error);
        return res
          .status(400)
          .json({ success: false, message: "Bad request!" });
      });
  }

  //delete team by id
  async updateTeamName(req, res) {
    const teamId = req.params.id;
    const { team_name } = req.body;
    console.log("teamID If: ", teamId, "teamName: ", team_name);
    await Team.findByIdAndUpdate({ _id: teamId }, { name: team_name })
      .lean()
      .then((team) => {
        console.log("New team updated name: ", team);
        return res.status(200).json({
          success: true,
          message: "Update team name successful",
          data: team,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(500)
          .json({ success: false, message: "Bad request!" });
      });
  }

  //delete team by id
  async deleteTeam(req, res) {
    //Get team id through params on URL
    const teamId = req.params.id;
    await Team.findByIdAndDelete({ _id: teamId })
      .lean()
      .then((team) => {
        return res.status(200).json({
          success: true,
          message: "Delete a team successful",
          data: team,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(400)
          .json({ success: false, message: "Bad request!" });
      });
  }

  //get team info
  async getDetails(req, res) {
    const teamId = req.params.teamId;
    // console.log("test team Id: ", teamId);

    await Team.findById(teamId)
      .populate("members")
      .populate("boards")
      .populate({ path: "spaces", populate: "createdBy" })
      .populate("createdBy")
      .then((team) => {
        if (!team)
          return res.status(404).json({
            success: false,
            message: "Team not found",
          });
        // console.log("test: ", team);
        return res.status(200).json({
          success: true,
          data: team,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(400)
          .json({ success: false, message: "Bad request!" });
      });
  }

  async addBoardToTeam(req, res) {
    const teamId = req.params.id;
    console.log("teamId: ", teamId);

    const { boardId } = req.body;
    console.log("boardId: ", boardId);
    await Team.findByIdAndUpdate(
      { _id: teamId },
      { $addToSet: { boards: boardId } },
      { new: true }
    )
      .populate("boards")
      .then((team) => {
        // team.populated("boards").boardId.teamId = teamId;

        return res.status(200).json({
          success: true,
          message: "Update teams successful",
          data: team,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(500)
          .json({ success: false, message: "Bad request!" });
      });
  }

  async addSpaceToTeam(req, res) {
    const teamId = req.params.id;
    console.log("teamId: ", teamId);

    const { spaceId } = req.body;
    console.log("spaceId: ", spaceId);
    await Team.findByIdAndUpdate(
      { _id: teamId },
      { $addToSet: { spaces: spaceId } },
      { new: true }
    )
      .populate("spaces")
      .then((team) => {
        // team.populated("spaces").spaceId.teamId = teamId;

        return res.status(200).json({
          success: true,
          message: "Update teams successful",
          data: team,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(500)
          .json({ success: false, message: "Bad request!" });
      });
  }

  async addMemberToTeam(req, res) {
    const teamId = req.params.id;
    console.log("teamId: ", teamId);

    const { memberEmail } = req.body;
    console.log("memberEmail: ", memberEmail);
    const user = await User.findOne({ email: memberEmail }).lean();
    console.log("USER ID: ", user._id);
    await Team.findByIdAndUpdate(
      { _id: teamId },
      { $addToSet: { members: user._id, } },
      { new: true }
    )
      .populate("members")
      .then((team) => {
        // team.populated("spaces").memberEmail.teamId = teamId;

        return res.status(200).json({
          success: true,
          message: "Update teams successful",
          data: team,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(500)
          .json({ success: false, message: "Bad request!" });
      });
  }

  async removeSpaceFromTeam(req, res) {
    const teamId = req.params.id;
    console.log("teamId: ", teamId);
    const { spaceId } = req.body;
    await Team.findByIdAndUpdate(
      { _id: teamId },
      { $pull: { spaces: spaceId } },
      { new: true }
    )
      .populate("spaces")
      .then((team) => {
        return res.status(200).json({
          success: true,
          message: "Remove the space from teams successful",
          data: team,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(500)
          .json({ success: false, message: "Bad request!" });
      });
  }
}

module.exports = new TeamController();
