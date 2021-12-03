const db = require("../models");
const ROLE = db.ROLES;
const User = db.user;

const checkDuplicatedEmail = (req, res, next) => {
	//Email
	User.findOne({ email: req.body.email }).exec((err, user) => {
		if (err) {
			res.status(500).json({ message: err });
			return;
		}
		if (user) {
			console.log('true is same')
			res.status(400).json({ message: "Failed! Email is already in use!" });
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
};
