import React, {useState} from "react";
import { Route, Redirect } from "react-router-dom";
import UserService from "../services/userService";
export const PrivateRoute = ({ component: Component, roles, ...rest }) => {
	// const { state, dispatch } = useContext(UserContext);
	const [user, setUser] = useState(null)
	// const location = useLocation();
	return (
		<Route
			{...rest}
			render={(props) => {
				// dispatch({ type: ACTIONS.GET_USER });
				UserService.getCurrentUser()
					.then((user) => {
						setUser(user)
						console.log("user: ", user)
					})
					.catch((error) => {
						throw new Error(error);
					});
				// const currentUser = AuthService.currentUserValue;
				if (!user) {
					// not logged in so redirect to login page with the return url
					return <Redirect to={{ pathname: "/login" }} />;
				}
				console.log("currentUser: ", user)
				// check if route is restricted by role
				if (roles && roles.indexOf(user.role) === -1) {
					// role not authorised so redirect to home page
					return <Redirect to={{ pathname: "/" }} />;
				}

				// authorised so return component
				return <Component {...props} />;
			}}
		/>
	);
};
