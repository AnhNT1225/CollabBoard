const { mongoose } = require("../models");

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
    // space.members.addToSet(req.user);
    // space: space,
    // contributors: contributors,

    //This populates the user id with actual author information!
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
      .populate('spaces')
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
    const { spaceName, boardId } = req.body;
    await Space.findByIdAndUpdate(
      { _id: spaceId },
      { $addToSet: { boards: boardId } },
      { new: true }
    )
      .populate("boards")
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
    await Space.findByIdAndUpdate(
      { _id: spaceId },
      { $pull: { boards: boardId } },
      { new: true }
    )
      .populate("boards")
      .then((space) => {
        return res.status(200).json({
          success: true,
          message: "Remove the board from spaces successful",
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
      .populate("boards")
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
    const { teamId} = req.body;
    Space.findByIdAndUpdate(
      { _id: spaceId },
      { teamId: teamId},
      { new: true }
    )
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
	console.log("teamId new: ", form.team.id)
    const { form } = req.body;
    //Find the team has name === new modified name, add spaceId to that team
    const team = await Team.findIdAndUpdate(
      { _id: form.team.id },
      { $addToSet: { spaces: spaceId } },
	  {new: true}
    ).lean();
	console.log('teamId new also : ', team._id)
    //Find the space by Id and update name and teamId
    Space.findByIdAndUpdate(
      { _id: spaceId },
      { name: form.name, teamId: team._id},
      { new: true }
    )
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
