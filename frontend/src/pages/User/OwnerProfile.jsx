import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Avatar, Tabs, Space } from "antd";
import "./styles.scss";
import { UserContext, ACTIONS } from "../../context/userContext";
import { getUserId } from "../../lib/auth";
import UserService from "../../services/userService";
// import AllBoardTab from "../../components/Tab/PrototypeTab/AllBoardTab";
const { TabPane } = Tabs;

const OwnerProfile = () => {
  const userId = getUserId();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    UserService.getUserById(userId)
      .then((response) => {
        dispatch({ type: ACTIONS.GET_USER, payload: response.user });
        // console.log("user response data: ", response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);
  const history = useHistory();
  const backToDashboard = () => {
    history.goBack(1);
  };

  const changeTab = (tab) => {
    console.log("key ", tab);
    switch (tab) {
      case "tab 1":
        // return <AllBoardTab />;
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="page_header">
        <button className="back_btn" onClick={backToDashboard}>
          <i id="back_icon" className="fas fa-chevron-left"></i>
        </button>
        <h2 className="page_title">User Profile</h2>
      </div>
      <div className="user_profile_container">
        <div className="user_present">
          <Avatar
            className="user_present_avatar"
            style={{ verticalAlign: "middle" }}
            size={70}
            src={state.user && state.user.avatar}
            onClick={(e) => e.preventDefault()}
          >
            <span>{state.user?.name.charAt(0)}</span>
          </Avatar>
          <div className="user_present_info">
            <b>{state.user?.name}</b>
            <br />
            <span>{state.user?.email}</span>
          </div>
        </div>
        <div className="user_info_detail">
          <Space direction="vertical">
            <span>Gender: {state.user?.gender}</span>
            <span>DoB: {state.user?.DoB}</span>
            <span>Working place: {state.user?.workingPlace}</span>
            <span>Position: {state.user?.position}</span>
          </Space>
		  <button className="edit_info_btn" onClick={() => history.push('/user/profiles/edit')}>
          <i className="far fa-edit"></i>
		  </button>
        </div>
      </div>
      <div className="user_management_wrap">
        <Tabs defaultActiveKey="tab 1" onChange={changeTab}>
          <TabPane tab="Current board" key="tab 1" />
          <TabPane tab="Spaces" key="tab 2" />
          <TabPane tab="Teams" key="tab 3" />
        </Tabs>
      </div>
    </>
  );
};

export default OwnerProfile;
