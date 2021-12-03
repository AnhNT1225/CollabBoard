require("dotenv").config();
// const db = require("../models");
// const User = db.user;
const googleOAuth = require("../utils/googleOAuth");
const mongoose = require("mongoose");
const User = require("../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
class AuthController {
  async signup(req, res) {
    const { name, email, password, gender, DoB } = req.body;
    console.log("name: ", DoB );

    //--------------------------------------------------
    //Cach 2
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      email: email,
      password: bcrypt.hashSync(password, 10),
      gender: gender,
      DoB: DoB
    });
    user
      .save()
      .then((data) => {
        console.log("User saved successfully!");
        res.status(200).json({
          success: true,
          message: "User was registered successfully!",
          user: data,
        });
      })
      .catch((err) => {
        console.log("Error: ", err);
        res.status(400).json({
          success: false,
          message: err,
        });
      });
  }

  login(req, res) {
    User.findOne({
      email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      let token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 86400, // 24 hours
      });

      res.status(200).json({
        success: true,
        accessToken: token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      });
    });
  }

  async loginAPI(req, res) {
    try {
      const code = req.body.code;
      const profile = await googleOAuth.getProfileInfo(code);
      console.log("payload: ", profile);
      const { email_verified, name, email, profilePic } = profile;
      // const user = {
      // 	googleId: profile.sub,
      // 	name: profile.name,
      // 	firstName: profile.given_name,
      // 	lastName: profile.family_name,
      // 	email: profile.email,
      // 	profilePic: profile.picture,
      // };
      // console.log("user: ", user);
      // res.send({ user });
      if (email_verified) {
		  console.log("EMAIL HERE: ", email)
        User.findOne({ email: email }).exec((err, user) => {
          if (err) {
          	return res.status(400).json({
          		success: false,
          		error: "Something went wrong...",
          	});
          } else {
          	if (user) {
          		const token = jwt.sign(
          			{ _id: user._id },
          			process.env.ACCESS_TOKEN_SECRET,
          			{
          				expiresIn: 86400, // 24 hours
          			}
          		);
          		const { _id, name, email, avatar, role } = user;
              let foundUser= {
                id: _id,
                name: name,
                email: email,
                avatar: avatar,
                role: role,
              }
          		res.json({ token, user: foundUser });
          	} else {
              console.log('create')
          		const newUser = new User({
          			_id: new mongoose.Types.ObjectId(),
          			name: name,
          			email: email,
          			password: bcrypt.hashSync(email, 10),
          			avatar: profilePic,
                role:'user'
          		});
          		newUser.save((err, data) => {
          			if (err) {
          				return res.status(400).json({
          					success: false,
          					error: "Something went wrong...",
          				});
          			}
          			const token = jwt.sign(
          				{ _id: data._id },
          				process.env.ACCESS_TOKEN_SECRET,
          				{
          					expiresIn: 86400, // 24 hours
          				}
          			);

          			// const { _id, name, email, avatar } = data;
                const createdUser =  data;
                delete createdUser.password
          			res.json({
          				token,
          				user: createdUser,
          			});
          		});
          	}
          }
        });
      }
    } catch (e) {
      console.log(e);
      res.status(401).send();
    }
  }

  async findUser(req, res) {
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
        },
      });
    } catch (error) {
      console.log("the catch error: ", error);
      return res.status(500).json({ success: false, message: "Bad request!" });
    }
  }

  forgotPassword = (req, res) => {
    const { email } = req.body;
    User.findOne({ email }, (err, user) => {
      if (err || !user) {
        return res
          .status(400)
          .json({ error: "User with this email does not exist." });
      }
      const token = jwt.sign({ _id: user.id }, process.env.RESET_PASSWORD_KEY, {
        expiresIn: "20m",
      });
      const emailData = {
        from: process.env.THE_HOST_EMAIL,
        to: email,
        subject: "Account confirmed Link",
        html: `
					<h2>Please click on given links below to reset your password </h2>
					<a href="${process.env.CLIENT_URL}/reset-password/${token}" />
				`,
      };

      return user.updateOne({ resetLink: token }, (err, success) => {
        if (err) {
          return res.status(400).json({ error: "Reset password link error." });
        } else {
        }
      });
    });
  };
}
module.exports = new AuthController();
