const { mongoose, board } = require("../models");

const Space = require("../models/Space");
const Board = require("../models/Board");
const Team = require("../models/Team");
const User = require("../models/User");
class SpaceController {
  createSpace(req, res) {
    const { spaceName } = req.body;
    const space = new Space({
      name: spaceName,
      createdBy: req.user,
    });
    space.members.addToSet(req.user);
    space
      .save()
      .then((data) => {
        console.log("Space saved successfully!");
        return res.status(201).json({
          success: true,
          message: `New space name ${data.name} is created successfully`,
          space: data,
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

  async getJoinedSpaces(req, res) {
    await Space.find({ members: req.user._id })
      .populate("createdBy", "_id name")
      .then((result) => {
        if (!result)
          return res.status(404).json({
            success: false,
            message: "Spaces not found",
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

  //------------------------------- OLD PART --------------- (REMOVE GET OWNED SPACES)

  //get the owned space that user created
  async getOwnedSpaces(req, res) {
    await Space.find({ createdBy: req.user._id })
      .populate("createdBy", "_id name")
      .then((result) => {
        if (!result)
          return res.status(404).json({
            success: false,
            message: "Spaces not found",
          });
        return res.status(200).json({
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

  async addBoardToSpace(req, res) {
    const spaceId = req.params.id;
    console.log("spaceId: ", spaceId);
    const { boardId } = req.body;
    await Board.findByIdAndUpdate(
      { _id: boardId },
      { spaceId: spaceId },
      { new: true }
    ).populate("spaceId");
    // console.log('today: ', updateBoard._id)
    await Space.findByIdAndUpdate(
      { _id: spaceId },
      { $addToSet: { boards: boardId }, updatedAt: new Date(Date.now()).toISOString() },
      { new: true }
    )
      .populate({ path: "boards", populate: "spaceId" })
      .populate('createdBy')
      .then((space) => {
        // space.populated("boards").boardId.spaceId = spaceId;

        return res.status(200).json({
          success: true,
          message: "Update spaces successful",
          data: space,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(500)
          .json({ success: false, message: "Bad request!" });
      });
  }

  //remove board store in space when board is delete
  async removeBoardFromSpace(req, res) {
    const spaceId = req.params.id;
    console.log("spaceId: ", spaceId);
    const { boardId } = req.body;
    const updateBoard = await Board.findByIdAndUpdate(
      { _id: boardId },
      { spaceId: null },
      { new: true }
    );
    await Space.findByIdAndUpdate(
      { _id: spaceId },
      { $pull: { boards: boardId }, updatedAt: new Date(Date.now()).toISOString(), },
      { new: true }
    )
    .populate({ path: "boards", populate: "spaceId" })
      .then((space) => {
        return res.status(200).json({
          success: true,
          message: "Remove the board from spaces successful",
          data: space,
          updatedBoard: updateBoard
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
  async deleteSpace(req, res) {
    //Get board id through params on URL
    const spaceId = req.params.id;
    await Space.findByIdAndDelete({ _id: spaceId })
      .lean()
      .then(() => {
        return res.status(200).json({
          success: true,
          message: "Delete a space successful",
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(400)
          .json({ success: false, message: "Bad request!" });
      });
  }

  //get space info
  async getDetails(req, res) {
    const spaceId = req.params.spaceId;
    // console.log("test space Id: ", spaceId);

    await Space.findById(spaceId)
      .populate({ path: "boards", populate: "spaceId" })
      .populate("createdBy")
      .populate("teamId")
      .then((space) => {
        if (!space) {
          return res.status(404).json({
            success: false,
            message: "Space not found",
          });
        }
        // console.log("test: ", space);
        return res.status(200).json({
          success: true,
          data: space,
        });
      })
      .catch((error) => {
        console.log("the catch error: ", error);
        return res
          .status(400)
          .json({ success: false, message: "Bad request!" });
      });
  }

  //add teamId for Space
  async setTeamForSpace(req, res) {
    const spaceId = req.params.id;
    const { teamId } = req.body;
    Space.findByIdAndUpdate({ _id: spaceId }, { teamId: teamId, updatedAt: new Date(Date.now()).toISOString(), }, { new: true })
      .then((space) => {
        return res.status(200).json({
          success: true,
          message: "Assign successfully team for space",
          data: space,
        });
      })
      .catch((error) => {
        console.log("error: ", error);
        return res.status
          .code(400)
          .json({ success: false, message: "Bad request!" });
      });
  }

  //UPDATE SPACE INFO (USE FOR SPACE EDIT PAGE)
  async updateSpaceInfo(req, res) {
    const spaceId = req.params.id;

    const { name, team, initialTeamId } = req.body;
    console.log(
      "name: ",
      name,
      "team: ",
      team,
      "initialTeamId: ",
      initialTeamId
    );
    let newUpdate;

    if (name && team && initialTeamId === undefined) {
      //Find the team has name === new modified name, add spaceId to that team
      // await Space.findByIdAndUpdate(
      //   { _id: team.id },
      //   { $addToSet: { spaces: spaceId } },
      //   { new: true }
      // ).lean();
      await Team.findByIdAndUpdate(
        { _id: team.id },
        { $addToSet: { spaces: spaceId } },
        { new: true }
      ).lean();
      newUpdate = {
        name: name,
        teamId: team.id,
        updatedAt: new Date(Date.now()).toISOString(),
      };
    } else if (name && team && initialTeamId !== undefined) {
      console.log("nhay vao teamID");
      //Find the team has name === new modified name, add spaceId to that team
      await Team.findByIdAndUpdate(
        { _id: initialTeamId },
        { $pull: { spaces: spaceId } },
        { new: true }
      ).lean();
      const teamB = await Team.findByIdAndUpdate(
        { _id: team.id },
        { $addToSet: { spaces: spaceId } },
        { new: true }
      ).lean();
      newUpdate = {
        name: name,
        teamId: teamB._id,
        updatedAt: new Date(Date.now()).toISOString(),
      };
    } else {
      console.log("ngon");
      newUpdate = {
        name: name,
        updatedAt: new Date(Date.now()).toISOString(),
      };
    }

    console.log("teamId input: ", team.id);
    //Find the space by Id and update name and teamId
    await Space.findByIdAndUpdate({ _id: spaceId }, newUpdate, { new: true })
      .populate("createdBy", "_id name")
      .then((space) => {
        return res.status(200).json({
          success: true,
          message: "Assign successfully teamId for space",
          data: space,
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

module.exports = new SpaceController();
