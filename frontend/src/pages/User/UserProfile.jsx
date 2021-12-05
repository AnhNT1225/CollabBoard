import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Avatar, DatePicker, Input, Button, Space } from "antd";
import "./styles.scss";
import { UserContext, ACTIONS } from "../../context/userContext";
import UserService from "../../services/userService";
import moment from "moment";
const UserProfile = (props) => {
  const userId = props.match.params.id;
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    UserService.getUserById(userId)
      .then((response) => {
        dispatch({ type: ACTIONS.GET_USER, payload: response });
        // console.log("user response data: ", response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, [userId]);

  return (
    <>
      <div className="page_header">
        <button className="back_btn" onClick={() => history.goBack(1)}>
          <i id="back_icon" className="fas fa-chevron-left"></i>
        </button>
        <h2 className="page_title">User Profile</h2>
      </div>
      <div className="profile_form">
        <div className="user_avatar_wrap">
          <Space direction="vertical">
            <Avatar
              className="user_avatar"
              style={{ verticalAlign: "middle" }}
              size={150}
              src={state.user && state.user.avatar}
              onClick={(e) => e.preventDefault()}
            >
              <span className="avatar_digit">{state.user?.name.charAt(0)}</span>
            </Avatar>
            <b>{state.user?.name}</b>
          </Space>
          {/* <b>{new Date(state.user?.DoB).getFullYear}</b> */}
        </div>

        <form className="user_info_wrap">
          <Space direction="vertical">
            <label>Email:</label>
            <Input value={state.user && state.user.email} readOnly />
            <label>Gender:</label>
            <Input title="" value="Male" readOnly />
            <label>DoB:</label>
            <Input title="" value={state.user?.DoB ? state.user?.DoB.split("T")[0] : "Not updated"} readOnly />
            <label>Working place:</label>
            <Input
              title=""
              value={
                state.user?.workingPlace
                  ? state.user?.workingPlace
                  : "Not updated"
              }
              readOnly
            />
            <label>Position:</label>
            <Input
              title=""
              value={
                state.user?.position ? state.user?.position : "Not updated"
              }
              readOnly
            />
          </Space>
        </form>
      </div>
    </>
  );
};

export default UserProfile;
