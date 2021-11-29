import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Avatar, Tabs, Space } from "antd";
import "./styles.scss";
import { UserContext, ACTIONS } from "../../context/userContext";
import { getUserId } from "../../lib/auth";
import UserService from "../../services/userService";
// import AllBoardTab from "../../components/Tab/PrototypeTab/AllBoardTab";

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
        </div>
      </div>
      {/* <div className="user_management_wrap"> */}
        {/* <Tabs defaultActiveKey="tab 1" onChange={changeTab}>
          <TabPane tab="Current board" key="tab 1" />
          <TabPane tab="Spaces" key="tab 2" />
          <TabPane tab="Teams" key="tab 3" />
        </Tabs> */}
        <div className="user_stats_container">
          <div className="user_all_stats">
            <p className="stats_title">Current board</p>
            <div className='stats_show'>
              <b className="stats_title">{state?.newUsers.length}</b>
            </div>
          </div>
          <div className="user_all_stats">
            <p className="stats_title">Current Spaces</p>
            <div className='stats_show'>
              <b className="stats_title">{state?.newUsers.length}</b>
            </div>
          </div>
          <div className="user_all_stats">
            <p className="stats_title">Current Teams</p>
            <div className='stats_show'>
              <b className="stats_title">{state?.newUsers.length}</b>
            </div>
          </div>
        </div>
      {/* </div> */}
    </>
  );
};

export default OwnerProfile;
