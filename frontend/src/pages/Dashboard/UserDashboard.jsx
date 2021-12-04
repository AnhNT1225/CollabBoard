import React, { useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import TopNav from "../../components/NavBar/DashboardNavbar";
import UserRoutes from "../../pages/Dashboard/UserRoutes";
import { UserContext, ACTIONS } from "../../context/userContext";
import UserService from "../../services/userService";
import { getUserId } from "../../lib/auth";
const UserDashboard = (props) => {
  const { socket } = props;
  const [searchInput, setSearchInput] = useState("");
  let { path } = useRouteMatch();
  const { state, dispatch } = useContext(UserContext);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const userId = getUserId();
    console.log("corona: ", userId);
    UserService.getUserById(userId)
      .then((response) => {
        console.log("HUNSD: ", response);
        dispatch({ type: ACTIONS.GET_USER, payload: response.user });
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, [dispatch]);

  console.log("user dashoard: ", state.user);
  const userItem = [
    {
      link: "/dashboard/prototypes",
      title: "Prototypes",
      icon: "fas fa-chalkboard",
      index: 1,
    },
    {
      link: "/dashboard/spaces",
      title: "Spaces",
      icon: "far fa-folder",
      index: 2,
    },
    {
      link: "/dashboard/teams",
      title: "Teams",
      icon: "fas fa-users",
      index: 3,
    },
  ];
  return (
    <div>
      {/* <Layout sidebarItem={userItem}/> */}
      <Sidebar sidebarItem={userItem} />
      <div className="layout__content">
        <TopNav
          dataSource={dataSource}
          setDataSource={setDataSource}
          setSearchInput={setSearchInput}
          dispatch={dispatch}
          state={state}
        />
        <div className="layout__content-main">
          <UserRoutes
            path={path}
            searchInput={searchInput}
            socket={socket}
            dataSource={dataSource}
            setDataSource={setDataSource}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
