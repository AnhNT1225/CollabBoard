import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Dropdown, Menu, Button, Tooltip, Input, Avatar } from "antd";
import { BellOutlined, DownOutlined, SearchOutlined } from "@ant-design/icons";
import { ACTIONS } from "../../context/userContext";
import "./styles.scss";
const DashBoardNavbar = (props) => {
  // const { state, dispatch } = useContext(UserContext);
  const { dataSource, setDataSource, setSearchInput, dispatch, state } = props;

  const history = useHistory();
  const logout = () => {
    dispatch({ type: ACTIONS.LOGOUT });
    history.replace("/");
  };

  const searchBoard = async (e) => {
    const boardName = await e.target.value;
    console.log("search name: ", boardName);
    setSearchInput(boardName);
    const filteredData = dataSource.filter((entry) =>
      entry.name.toLowerCase().includes(boardName.toLowerCase())
    );
    setDataSource(filteredData);
    // history.replace(`/board?name=${boardName}`);
  };

  const menu = (
    <Menu className="dropdown_menu">
      <div className="user_frame">
        <Avatar
          className="user_frame_avatar"
          style={{ verticalAlign: "middle" }}
          size={50}
          src={state.user && state.user.avatar}
          onClick={(e) => e.preventDefault()}
        >
          <span>{state.user?.name.charAt(0)}</span>
        </Avatar>
        <div className="user_frame_info">
          <b>{state.user?.name}</b>
          <br />
          <span>{state.user?.email}</span>
        </div>
      </div>
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
    <div className="header_wrap">
      <div className="left-header">
        <Input
          className="search_dashoard"
          prefix={<SearchOutlined style={{ fontSize: 20 }} />}
          placeholder="Search document or space"
          style={{
            borderRadius: "30px",
            width: "300px",
            height: "50px",
          }}
          onChange={searchBoard}
        />
      </div>
      <div className="right-header">
        <Tooltip title="notification">
          <Button
            type="link"
            style={{ color: "black" }}
            size="large"
            icon={<BellOutlined />}
          />
        </Tooltip>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button shape="round" onClick={(e) => e.preventDefault()}>
            <p>
              {state.user && state.user.name} <DownOutlined />
            </p>
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default DashBoardNavbar;
