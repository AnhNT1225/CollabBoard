const User = require("../models/User");
const endOfDay = require("date-fns/endOfDay");
const startOfDay = require("date-fns/startOfDay");
const bcrypt = require("bcryptjs");

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
      user.password = undefined;
      return res.status(200).json({
        success: true,
        user: user,
      });
    } catch (error) {
      console.log("the catch error: ", error);
      return res.status(500).json({ success: false, message: "Bad request!" });
    }
  }

  async findUserById(req, res) {
    const userId = req.params.id;
    console.log("userId: ", userId);
    try {
      const user = await User.findById({ _id: userId }).lean();
      console.log("NOi voi em 1 loi", user);
      const foundUser = { ...user };
      if (!foundUser) {
        return res
          .status(404)
          .json({ success: false, message: "User Not found." });
      }
      delete foundUser.password;
      return res.status(200).json({
        success: true,
        user: foundUser,
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
      const user = await User.find({ role: "user" }).lean();
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
      const user = await User.find({
        createdAt: {
          $gte: startOfDay(new Date()),
          $lte: endOfDay(new Date()),
          role: "user",
        },
      });
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

  async updateUserPassword(req, res) {
    const { password } = req.body;
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        password: bcrypt.hashSync(password, 10),
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

  async deleteUser() {
    const userId = req.params.id;
    console.log("userId: ", userId);
    try {
      const user = await User.findByIdAndDelete({ _id: userId }).lean();
      return res.status(200).json({
        success: true,
        message: "Delete a user successful",
        data: user,
      });
    } catch (error) {
      console.log("the catch error: ", error);
      return res.status(400).json({ success: false, message: "Bad request!" });
    }
  }
}
module.exports = new UserController();
