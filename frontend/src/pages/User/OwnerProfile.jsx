import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Avatar, Space, Row, Col } from "antd";
import "./styles.scss";
import { UserContext, ACTIONS } from "../../context/userContext";
import { BoardContext } from "../../context/boardContext";
import {SpaceContext} from '../../context/spaceContext';
import {TeamContext} from '../../context/teamContext';
import BoardService from "../../services/boardService";
import SpaceService from "../../services/spaceService";
import TeamService from "../../services/teamService";
import { getUserId } from "../../lib/auth";
import UserService from "../../services/userService";
import BackgroundImage from '../../assets/images/cute_background.jpg'
// import AllBoardTab from "../../components/Tab/PrototypeTab/AllBoardTab";

const OwnerProfile = () => {
  const userId = getUserId();
  const { state, dispatch } = useContext(UserContext);
  const { boardState, boardDispatch } = useContext(BoardContext);
  const { spaceState, spaceDispatch } = useContext(SpaceContext);
  const { teamState, teamDispatch } = useContext(TeamContext);
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

    useEffect(() => {
    boardDispatch({ type: "FETCH_BOARDS_REQUEST" });
    BoardService.getOwnedBoard()
      .then(async (response) => {
        await boardDispatch({
          type: "FETCH_BOARDS_SUCCESS",
          payload: response.data,
        });
      })
      .catch((error) => {
        console.log("err: ", error);
        boardDispatch({
          type: "FETCH_DATA_FAILURE",
        });
      });
    return () => {
      boardDispatch({ type: "FETCH_DATA_FAILURE" });
    };
  }, [boardDispatch]);

  useEffect(() => {
    spaceDispatch({ type: "FETCH_SPACES_REQUEST" });
    SpaceService.getOwnedSpaces()
      .then(async (response) => {
        await spaceDispatch({
          type: "FETCH_SPACES_SUCCESS",
          payload: response.data,
        });
      })
      .catch((error) => {
        console.log("err: ", error);
        spaceDispatch({
          type: "FETCH_DATA_FAILURE",
        });
      });
    return () => {
      spaceDispatch({ type: "FETCH_DATA_FAILURE" });
    };
  }, [spaceDispatch]);

  useEffect(() => {
    teamDispatch({ type: "FETCH_TEAMS_REQUEST" });
    TeamService.getJoinedTeam()
      .then((result) => {
        teamDispatch({ type: "FETCH_TEAMS_SUCCESS", payload: result.data });
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
    <div className='owner_profile' style={{backgroundImage: `url(${BackgroundImage})`}}>
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
            <Row gutter={[8, 8]}>
              <Col span={12} ><span style={{fontWeight: 'bold'}}>Gender:</span></Col>
              <Col span={12} >{state.user?.gender ? state.user?.gender : 'Not updated'}</Col>
            </Row>
            <Row gutter={[8, 8]}>
              <Col span={12} ><span style={{fontWeight: 'bold'}}>DoB:</span></Col>
              <Col span={12} >{state.user?.DoB ? state.user?.DoB.split("T")[0] : "Not updated"}</Col>
            </Row>
            <Row gutter={[8, 8]}>
              <Col span={12} ><span style={{fontWeight: 'bold'}}>Working place:</span></Col>
              <Col span={12} >{state.user?.workingPlace
                ? state.user?.workingPlace
                : "Not updated"}</Col>
            </Row>
            <Row gutter={[8, 8]}>
              <Col span={12} ><span style={{fontWeight: 'bold'}}>Position:</span></Col>
              <Col span={12} >{state.user?.position ? state.user?.position : "Not updated"}</Col>
            </Row>
            {/* <span>
              DoB:{" "}
              {state.user?.DoB ? state.user?.DoB.split("T")[0] : "Not updated"}
            </span>
            <span>
              Working place:{" "}
              {state.user?.workingPlace
                ? state.user?.workingPlace
                : "Not updated"}
            </span>
            <span>
              Position:{" "}
              {state.user?.position ? state.user?.position : "Not updated"}
            </span> */}
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
          <div className="stats_show">
            <b className="stats_title">{boardState?.boards.length}</b>
          </div>
        </div>
        <div className="user_all_stats">
          <p className="stats_title">Current Spaces</p>
          <div className="stats_show">
            <b className="stats_title">{spaceState?.spaces.length}</b>
          </div>
        </div>
        <div className="user_all_stats">
          <p className="stats_title">Current Teams</p>
          <div className="stats_show">
            <b className="stats_title">{teamState?.teams.length}</b>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default OwnerProfile;
