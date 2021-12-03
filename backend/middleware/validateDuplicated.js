const db = require("../models");
const User = db.user;
const Team = require("../models/Team");
const checkDuplicatedEmail = (req, res, next) => {
	//Email
	User.findOne({ email: req.body.email }).exec((err, user) => {
		if (err) {
			res.status(500).json({ message: err });
			return;
		}
		if (user) {
			res.status(400).json({ message: "Failed! Email is already in used!" });
			return;
		}
		next();
	});
};

const checkTeamName = (req, res, next) => {
	//Email
	const { teamName } = req.body;
	Team.findOne({ name: teamName }).exec((err, team) => {
		if (err) {
			res.status(500).json({ message: err });
			return;
		}
		if (team) {
			res.status(400).json({ message: "Failed! Team name is already in used!" });
			return;
		}
		next();
	});
};

// checkRolesExisted = (req, res, next) => {
// 	const roles = req.body.roles;
// 	if (roles) {
// 		for (let i = 0; i < roles.length; i++) {
// 			if (!ROLE.includes(roles[i])) {
// 				res
// 					.status(400)
// 					.send({ message: `Failed! Role ${roles[i]} does not exist!` });
// 				return;
// 			}
// 		}
// 	}
// 	next();
// };

module.exports = {
	checkDuplicatedEmail: checkDuplicatedEmail,
	checkTeamName: checkTeamName
};
