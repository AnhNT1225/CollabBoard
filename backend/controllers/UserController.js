const User = require("../models/User");

class UserController {
  async findUserByEmail(req, res) {
    const email = req.user.email;
    try {
      const user = await User.findOne({ email }).lean();
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User Not found." });
      }
      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
        },
      });
    } catch (error) {
      console.log("the catch error: ", error);
      return res.status(500).json({ success: false, message: "Bad request!" });
    }
  }

  async findUserById(req, res) {
    const userId = req.params.userId;
    try {
      const user = await User.findById({ _id: userId }).lean();
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User Not found." });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          DoB: user.DoB,
          gender: user.gender,
        },
      });
    } catch (error) {
      console.log("the catch error: ", error);
      return res.status(500).json({ success: false, message: "Bad request!" });
    }
  }

  async findAllUsers(req, res) {
    const timeFromClient = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    console.log("time from client: ", timeFromClient);
    try {
      const filter = {};
      const user = await User.find(filter);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Users Not found." });
      }
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.log("the catch error: ", error);
      return res.status(500).json({ success: false, message: "Bad request!" });
    }
  }

  async findNewUsers(req, res) {
    try {
      const user = await User.find({}).where("createdAt");
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Users Not found." });
      }
      console.log("user: ", user);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.log("the catch error: ", error);
      return res.status(500).json({ success: false, message: "Bad request!" });
    }
  }

  async updateUserInfo(req, res) {
    const { name, email, DoB, gender, workingPlace, position } = req.body;
    const avatar = req.file.filename;
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        name: name,
        email: email,
        DoB: DoB,
        gender: gender,
        workingPlace: workingPlace,
        position: position,
        avatar: avatar,
      },
      { new: true }
    )
      .then((user) => {
        res.status(200).json({
          success: true,
          data: user,
        });
      })
      .catch((err) => res.status(400).json("Error: " + err));
  }
}
module.exports = new UserController();
