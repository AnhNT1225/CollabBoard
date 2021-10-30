import React from "react";

import { Route, Switch } from "react-router-dom";
import AccountManagement from "./AccountManagement";
import BoardManagement from "./BoardManagement";
import Overview from "./Overview";
import TeamManagement from "./TeamManagement";

const AdminRoutes = (props) => {
	console.log("props path: ", props);
	return (
		<Switch>
			<Route path={`${props.path}/overview`}>
				<Overview searchInput={props.searchInput} />
			</Route>
			<Route path={`${props.path}/accounts`}>
				<AccountManagement searchInput={props.searchInput} />
			</Route>
            <Route path={`${props.path}/boards`}>
				<BoardManagement searchInput={props.searchInput} />
			</Route>
			<Route path={`${props.path}/teams`}>
				<TeamManagement searchInput={props.searchInput}/>
			</Route>
		</Switch>
	);
};

export default AdminRoutes;