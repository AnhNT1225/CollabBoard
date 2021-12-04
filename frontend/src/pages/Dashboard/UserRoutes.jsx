import React from "react";

import { Route, Switch } from "react-router-dom";
import Propotypes from "./Prototypes";
import Spaces from "./Spaces";
import Teams from "./Teams";
import RecentWorkspace from "./RecentWorkspace";
import TeamResult from '../../components/Tab/TeamTab/TeamResult';
import TeamEdit from "../../components/Tab/TeamTab/TeamEdit";
import SpaceEdit from '../../components/Tab/SpaceTab/SpaceEdit';
import SpaceResult from '../../components/Tab/SpaceTab/SpaceResult';


const UserRoutes = (props) => {
	console.log("props path: ", props);
	return (
		<Switch>
			<Route exact path={`${props.path}`}>
				<RecentWorkspace searchInput={props.searchInput} socket={props.socket}/>
			</Route>
			<Route exact path={`${props.path}/prototypes`}>
				<Propotypes searchInput={props.searchInput} socket={props.socket}/>
			</Route>
			<Route exact path={`${props.path}/spaces`}>
				<Spaces searchInput={props.searchInput} setDataSource={props.setDataSource} dataSource={props.dataSource}/>
			</Route>
			<Route exact path={`${props.path}/teams`}>
				<Teams searchInput={props.searchInput} setDataSource={props.setDataSource} dataSource={props.dataSource}/>
			</Route>
			<Route exact path={`${props.path}/teams/:teamId`} component={TeamResult}/>
			<Route path={`${props.path}/teams/:teamId/edit`} component={TeamEdit}/>
			<Route exact path={`${props.path}/spaces/:spaceId`} component={SpaceResult}/>
			<Route path={`${props.path}/spaces/:spaceId/edit`} component={SpaceEdit}/>
		</Switch>
	);
};

export default UserRoutes;
