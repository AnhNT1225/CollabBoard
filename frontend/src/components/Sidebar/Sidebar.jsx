import React, { useContext } from "react";
import Logo from "../Logo";
import SidebarItem from "./SideBarItem";
import { Dropdown, Menu, Button, Divider } from "antd";
import { Link, useHistory} from "react-router-dom";
import { UserContext, ACTIONS } from "../../context/userContext";
import TeamQuickAccess from "../TeamQuickAccess/TeamQuickAccess";
const SideBar = (props) => {
  const { admin} = props;
  const { dispatch } = useContext(UserContext);
    const history = useHistory();
  const logout = () => {
    dispatch({ type: ACTIONS.LOGOUT });
    history.replace("/");
  };
  console.log('admin side: ', admin)
  const menu = (
    <Menu className="dropdown_menu">
      <Menu.Item key="0" className="dropdown_item">
        <Link to={`/user/profiles`}>
          <i className="fas fa-user-edit"></i>
          My profile
        </Link>
      </Menu.Item>
      <Menu.Item key="1" className="dropdown_item">
        <Link to={"/user/settings"}>
          <i className="fa fa-cog" aria-hidden="true"></i>
          Settings
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2" className="dropdown_item" onClick={logout}>
        <i className="fas fa-sign-out-alt">Sign out</i>
      </Menu.Item>
    </Menu>
  );
  return (
    <div className="sidebar">
      <Logo />
      <SidebarItem
        {...props}
        // active={index === activeItem}
      />
      {admin? (
        <div className="admin_frame">
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button
              shape="round"
              style={{ width: "100%" }}
              onClick={(e) => e.preventDefault()}
            >
              <p>
                Welcome, {admin?.name} <i className="fas fa-angle-up"></i>
              </p>
            </Button>
          </Dropdown>
        </div>
      ) : (
        <div className="user_frame">
          <Divider />
          <TeamQuickAccess/>
        </div>
      )}
    </div>
  );
};

export default SideBar;
