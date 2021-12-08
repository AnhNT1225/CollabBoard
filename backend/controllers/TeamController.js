const endOfDay = require("date-fns/endOfDay");
const startOfDay = require("date-fns/startOfDay");
const Space = require("../models/Space");
const Board = require("../models/Board");
const Team = require("../models/Team");
const User = require("../models/User");
// const Space = require('../models/Space');
class TeamController {
  createTeam(req, res) {
    const { teamName } = req.body;
    const team = new Team({
      name: teamName,
      createdBy: req.user,
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

  async findNewTeams(req, res) {
    try {
      const team = await Team.find({
        createdAt: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) },
      });
      if (!team) {
        return res
          .status(404)
          .json({ success: false, message: "New teams not found." });
      }
      console.log("team: ", team);
      return res.status(200).json({
        success: true,
        data: team,
      });
    } catch (error) {
      console.log("the catch error: ", error);
      return res.status(500).json({ success: false, message: "Bad request!" });
    }
  }

  // GET TEAMS HAS LARGEST BOARDS (FOR ADMIN)
  async getMaxBoardsTeams(req, res) {
    await Team.find({})
      .sort("-boards")
      .limit(5)
      .populate("members")
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
    await Team.find({ members: req.user._id })
      .populate("members")
      .populate({ path: "boards", populate: "spaceId" })
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

  //update team by id
  async updateTeamName(req, res) {
    const teamId = req.params.id;
    const { team_name } = req.body;
    console.log("teamID If: ", teamId, "teamName: ", team_name);
    await Team.findByIdAndUpdate(
      { _id: teamId },
      { name: team_name },
      { new: true }
    )
      .lean()
      .populate("members")
      .populate("createdBy")
      .then((team) => {
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
    await Space.deleteMany({ teamId: teamId }).lean();
    await Board.deleteMany({ teamId: teamId }).lean();
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
  async getTeamDetails(req, res) {
    const teamId = req.params.teamId;
    // console.log("test team Id: ", teamId);

    await Team.findById(teamId)
      .populate("members")
      .populate({ path: "boards", populate: "spaceId" })
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
    const { boardName } = req.body;
    console.log("boardName: ", boardName);
    const foundTeam = await Team.findById({ _id: teamId }).lean();
    const foundBoard = await Board.findOneAndUpdate(
      {
        createdBy: req.user._id,
        name: boardName,
      },
      { teamId: teamId, contributors: foundTeam.members },
      { new: true }
    ).lean();
    console.log("BOARD ID: ", foundBoard._id);

    // const { boardId } = req.body;
    // console.log("boardId: ", boardId);
    await Team.findByIdAndUpdate(
      { _id: teamId },
      { $addToSet: { boards: foundBoard._id } },
      { new: true }
    )
      .populate("members")
      .populate({ path: "boards", populate: ["spaceId", 'createdBy'] })
      .populate({ path: "spaces", populate: "createdBy" })
      .populate("createdBy")
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
    const { spaceName } = req.body;
    console.log("spaceName: ", spaceName);
    const foundTeam = await Team.findById({ _id: teamId }).lean();
    const foundSpace = await Space.findOneAndUpdate(
      {
        createdBy: req.user._id,
        name: spaceName,
      },
      { teamId: teamId, members: foundTeam.members },
      { new: true }
    ).lean();
    console.log("SPACE ID: ", foundSpace._id);

    await Team.findByIdAndUpdate(
      { _id: teamId },
      { $addToSet: { spaces: foundSpace._id } },
      { new: true }
    )
      .lean()
      .populate("members")
      .populate({path: "boards", populate: ["spaceId", 'createdBy']})
      .populate({ path: "spaces", populate: "createdBy" })
      .populate("createdBy")
      .then((team) => {
        // team.populated("spaces").spaceId.teamId = teamId;
        console.log('LLLLLLLL team: ', team)
        return res.status(200).json({
          success: true,
          message: "Update spaces in team successful",
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
    // console.log("teamId: ", teamId);

    const { memberEmail } = req.body;
    // console.log("memberEmail: ", memberEmail);
    const user = await User.findOne({ email: memberEmail }).lean();
    // console.log("USER ID: ", user._id);
    const spaceInTeam = await Space.find({teamId: teamId})
    console.log('spaces in team: ', spaceInTeam)
    spaceInTeam.map(async(space) => {
      space.members.push(user._id)
      console.log('space members: ', space.members)
      await space.save()
    })

    const boardInTeam = await Board.find({teamId: teamId})
    console.log('boards in team: ', boardInTeam)
    boardInTeam.map(async(board) => {
      board.contributors.push(user._id)
      console.log('board members: ', board.contributors)
      await board.save()
    })
    console.log('boards in team 2: ', boardInTeam)
    await Team.findByIdAndUpdate(
      { _id: teamId },
      { $addToSet: { members: user._id } },
      { new: true }
    )
      .populate("members")
      .populate("boards")
      .populate({ path: "spaces", populate: "createdBy" })
      .populate("createdBy")
      .then((team) => {
        // team.populated("spaces").memberEmail.teamId = teamId;
        return res.status(200).json({
          success: true,
          message: "Update teams successful",
          data: team,
          updateSpace: spaceInTeam
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

  async removeMemberFromTeam(req, res) {
    const teamId = req.params.id;
    console.log("teamId: ", teamId);
    const { selectedMemberId } = req.body;
    console.log("selectedMemberId: ", selectedMemberId);

    const spaceInTeam = await Space.find({teamId: teamId})
    console.log('spaces in team: ', spaceInTeam)
    spaceInTeam.map(async(space) => {
      space.members.pull(selectedMemberId)
      console.log('space members: ', space.members)
      await space.save()
    })

    const boardInTeam = await Board.find({teamId: teamId})
    console.log('boards in team: ', boardInTeam)
    boardInTeam.map(async(board) => {
      board.contributors.pull(selectedMemberId)
      console.log('board contributors: ', board.contributors)
      await board.save()
    })

    selectedMemberId.forEach(async (memId) => {
      await Team.findByIdAndUpdate(
        { _id: teamId },
        { $pull: { members: memId } },
        { new: true }
      )
        .populate("members")
        .populate("createdBy")
        .then((team) => {
          return res.status(200).json({
            success: true,
            message: "Remove the member from teams successful",
            data: team,
          });
        })
        .catch((error) => {
          console.log("the catch error: ", error);
          return res
            .status(500)
            .json({ success: false, message: "Bad request!" });
        });
    });
  }
}

module.exports = new TeamController();
