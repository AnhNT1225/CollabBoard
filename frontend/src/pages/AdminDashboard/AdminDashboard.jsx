import React, { useState, useEffect, useContext } from "react";
import { useRouteMatch } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import TopNav from "../../components/NavBar/AdminNavBar";
import AdminRoutes from "./AdminRoutes";
import UserService from '../../services/userService';
import {UserContext, ACTIONS} from '../../context/userContext';
import './styles.scss';
import { getUserId } from "../../lib/auth";
const AdminDashboard = () => {
  const [searchInput, setSearchInput] = useState("");
  let { path, url } = useRouteMatch();
  const { dispatch } = useContext(UserContext);
  const [user, setUser] = useState(null)
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    const userId = getUserId()
    UserService.getUserById(userId)
      .then((response) => {
        dispatch({ type: ACTIONS.GET_USER, payload: response });
        setUser(response)
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, [dispatch]);
  console.log("path: ", path);
  const adminItem = [
    {
      link: `${url}/overview`,
      title: "Overview",
      icon: "far fa-chart-bar",
    },
    {
      link: `${url}/accounts`,
      title: "Accounts Control",
      icon: "fas fa-user-cog",
    },
    {
      link: `${url}/boards`,
      title: "Boards Control",
      icon: "fas fa-chalkboard",
    },
    {
      link: `${url}/teams`,
      title: "Teams Control",
      icon: "fas fa-users-cog",
    },
  ];
  console.log('admin dash: ', user)
  console.log('dataSOuce: ', dataSource)
  return (
    <>
      <Sidebar sidebarItem={adminItem} admin={user?.user}/>
      <div className="layout__content">
        <TopNav setSearchInput={setSearchInput} dataSource={dataSource} setDataSource={setDataSource}/>
        <div className="layout__content-main">
          <AdminRoutes path={path} searchInput={searchInput} setDataSource={setDataSource} dataSource={dataSource}/>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
