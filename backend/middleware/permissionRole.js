// middleware for doing role-based permissions
function permit(...permittedRoles) {
	// return a middleware
	return (req, res, next) => {
		const { user } = req;
		if (user && permittedRoles.includes(user.role)) {
			console.log("ok");
			next(); // role is allowed, so continue on the next middleware
		} else {
			res.status(403).json({ message: "Forbidden" }); // user is forbidden
		}
	};
}

module.exports = { permit };
