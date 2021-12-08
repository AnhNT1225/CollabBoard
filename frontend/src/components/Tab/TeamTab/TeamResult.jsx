import React, { useEffect, useState, useContext } from "react";
import {
  Breadcrumb,
  Button,
  Tag,
  Tabs,
  Modal,
  Avatar,
  message,
  Input,
  Form,
  Popconfirm,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import TeamService from "../../../services/teamService";
import ItemCards from "../../ItemCards/ItemCard";
import { BoardContext } from "../../../context/boardContext";
import BoardService from "../../../services/boardService";
import { SpaceContext } from "../../../context/spaceContext";
import { TeamContext } from "../../../context/teamContext";
import SpaceService from "../../../services/spaceService";
import { getUserId } from "../../../lib/auth";
const { TabPane } = Tabs;

const TeamResult = (props) => {
  const teamId = props.match.params.teamId;
  const sideComponent = useLocation();
  console.log("teamId handler pass Link: ", teamId);
  console.log("param1 handler pass Link: ", sideComponent.param1);
  const userId = getUserId();
  // const [team, setTeam] = useState(null);
  const { boardDispatch } = useContext(BoardContext);
  const { spaceDispatch } = useContext(SpaceContext);
  const { teamState, teamDispatch } = useContext(TeamContext);
  // const [boardSelectionModal, setBoardSelectionModal] = useState(false);
  const [createSpaceModal, setCreateSpaceModal] = useState(false);
  const [createBoardModal, setCreateBoardModal] = useState(false);
  const [email, setEmail] = useState("");
  // const emailRef = useRef('');

  const time = new Date(teamState.team?.createdAt).toLocaleDateString("en-EN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const [tab, setTab] = useState(null);
  function changeTab(key) {
    console.log(key);
    setTab(key);
  }

  useEffect(() => {
    TeamService.getTeamById(teamId)
      .then((result) => {
        console.log("result team : ", result);
        teamDispatch({ type: "FETCH_TEAM_SUCCESS", payload: result.data });
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  }, [teamDispatch, teamId]);

  // const createNewBoard =() => {
  //   const boardCode = await genRandomCode();
  //   await BoardService.createBoard(boardCode)
  //     .then(async (response) => {
  //       console.log("newBoard: ", response.board);
  //       console.log("socket is something: ", socket);
  //       await socket.emit("create-room", response.board.code);
  //       history.push({ pathname: `/board/${response.board._id}` });
  //     })
  //     .catch((error) => {
  //       console.log("error: ", error);
  //     });
  // }

  const createNewSpace = async (form) => {
    await SpaceService.createSpace(form.spaceName)
      .then((result) => {
        console.log("result: ", result);
        spaceDispatch({ type: "CREATE_SPACE", payload: result.space });
        message.success(result.message);
      })
      .catch((error) => {
        console.log("error: ", error);
        message.error("The space name has been used before!");
      });

    await TeamService.addSpaceToTeam(teamId, form.spaceName)
      .then((result) => {
        console.log("add space to team result: ", result);
        teamDispatch({ type: "FETCH_TEAM_SUCCESS", payload: result.data });
      })
      .catch((error) => {
        console.log("error: ", error);
        // if (error) {
        //   throw new Error("The space haven't add to the team.");
        // }
      });
    setCreateSpaceModal(false);
    // setSpaceName("");
  };

  const createNewBoard = async (form) => {
    await BoardService.createBoard(form.boardName)
      .then((result) => {
        console.log("result: ", result);
        boardDispatch({ type: "CREATE_BOARD", payload: result.board });
        message.success(result.message);
      })
      .catch((error) => {
        console.log("error: ", error);
      });

    await TeamService.addBoardToTeam(teamId, form.boardName)
      .then((result) => {
        console.log("add board to team result: ", result);
        teamDispatch({ type: "FETCH_TEAM_SUCCESS", payload: result.data });
      })
      .catch((error) => {
        console.log("error: ", error);
      });
    setCreateBoardModal(false);
  };

  const inviteMember = async (e) => {
    e.preventDefault();
    await TeamService.addMemberToTeam(teamId, email)
      .then((result) => {
        console.log("space add: ", result);
        console.log("add member to team result: ", result);
        teamDispatch({ type: "FETCH_TEAM_SUCCESS", payload: result.data });
        // spaceDispatch({type: })
      })
      .catch((error) => {
        console.log("error: ", error);
        if (error) {
          throw new Error("Failed to add new member to the team.");
        }
      });
    setEmail("");
    // emailRef.current = ''
  };

  const deleteTeam = async() => {
    // console.log(e);
    // console.log("is that id: ", id);
    teamDispatch({ type: "DELETE_TEAM", payload: teamId });
    await TeamService.deleteTeam(teamId)
      .then((result) => {
        console.log("result: ", result);
        message.success(result.message);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };
  //----------------------------------------------------------------

  const viewChat = () => {};

  //-------------------------------Return-----------------------------------------
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={"/"}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={"/dashboard"}>
            <span>Dashboard</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={"/dashboard/teams"}>
            <span>Teams</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <b>{teamState.team?.name}</b>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="team_result_wrap">
        <div className="team_info">
          <h1>Team : {teamState.team?.name}</h1>
          <span>Total Members: {teamState.team.members?.length}</span>
          <p>Created At: {time}</p>
          <b>Host: {teamState.team.createdBy?.name}</b>
        </div>

        {tab === "1" && teamState.team.createdBy?._id === userId ? (
          <div className="team_actions">
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={deleteTeam}
              okText="Yes"
              cancelText="No"
            >
              <Button>
                {" "}
                <i className="far fa-trash-alt"></i>
                <span> Delete</span>
              </Button>
            </Popconfirm>
          </div>
        ) : tab === "2" && teamState.team.createdBy?._id === userId ? (
          <div className="team_actions">
            {/* <Button onClick={createNewBoard}>Add new board</Button> */}
            <Button
              onClick={(e) => {
                setCreateBoardModal(true);
              }}
            >
              + Create board
            </Button>
            <Modal
              title="Create new board"
              // bodyStyle={{ padding: "2rem", height: 300 }}
              style={{ textAlign: "center" }}
              centered
              visible={createBoardModal}
              onOk={() => setCreateBoardModal(false)}
              onCancel={() => setCreateBoardModal(false)}
              footer={null}
              keyboard
              destroyOnClose={true}
            >
              <Form
                className="room_code_wrapper"
                onFinish={createNewBoard}
                scrollToFirstError
                autoComplete="off"
              >
                <label className="room_code_label">New board name</label>
                <br />
                <Form.Item
                  name="boardName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your board name!",
                    },
                    {
                      whitespace: true,
                      message: "Please enter some characters!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input
                    style={{ width: 250, height: 40, textAlign: "center" }}
                    name="boardName"
                    // onChange={changeBoardName}
                  />
                </Form.Item>
                <br />
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  style={{ width: 100, borderRadius: 5, fontWeight: "bold" }}
                >
                  Create
                </Button>
              </Form>
            </Modal>
          </div>
        ) : tab === "3" && teamState.team.createdBy?._id === userId ? (
          <div className="team_actions">
            <Button onClick={() => setCreateSpaceModal(true)}>
              + Create space
            </Button>
            <Modal
              title="Create new space"
              // bodyStyle={{ padding: "2rem", height: 300 }}
              style={{ textAlign: "center" }}
              centered
              visible={createSpaceModal}
              onOk={() => setCreateSpaceModal(false)}
              onCancel={() => setCreateSpaceModal(false)}
              footer={null}
              keyboard
              destroyOnClose={true}
            >
              <Form
                className="room_code_wrapper"
                onFinish={createNewSpace}
                scrollToFirstError
                autoComplete="off"
              >
                <label className="room_code_label">Space name</label>
                <br />
                <Form.Item
                  name="spaceName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your space name!",
                    },
                    {
                      whitespace: true,
                      message: "Please enter some characters!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input
                    style={{ width: 250, height: 40, textAlign: "center" }}
                    // onChange={changeSpaceName}
                    name="spaceName"
                  />
                </Form.Item>
                <br />
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  style={{ width: 100, borderRadius: 5, fontWeight: "bold" }}
                >
                  Create
                </Button>
              </Form>
            </Modal>
          </div>
        ) : null}
      </div>
      <Tabs defaultActiveKey="1" onChange={changeTab}>
        <TabPane tab="Members" key="1">
          <div className="members_list">
            <h3>Member list</h3>
            <form onSubmit={inviteMember}>
              <Input
                type="email"
                style={{ width: 300 }}
                placeholder="Enter user email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button htmlType="submit">Invite</Button>
            </form>
            <table className="table table-hover">
              <tbody>
                {teamState.team.members?.map((mem) => {
                  return (
                    <tr key={mem._id}>
                      <td>
                        <div className="member_row">
                          <Avatar
                            className="user_avatar"
                            style={{ verticalAlign: "middle" }}
                            size={50}
                            // src={mem.avatar}
                            onClick={(e) => e.preventDefault()}
                          >
                            <span className="avatar_digit">
                              {mem.name?.charAt(0)}
                            </span>
                          </Avatar>
                          <div className="member_info">
                            <span className="member_name">{mem.name} </span>
                            {teamState.team.createdBy?.name === mem.name ? (
                              <Tag color="blue">Owner</Tag>
                            ) : (
                              <Tag color="green">Member</Tag>
                            )}

                            <br />
                            <span className="member_email">{mem.email}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabPane>
        <TabPane tab="Boards" key="2">
          <div className="item_wrap">
            {teamState.team.boards?.map((board, index) => {
              console.log("teamState.team.boards: ", teamState.team?.boards);
              return (
                <ItemCards
                  key={index}
                  board={board}
                  sideComponent={sideComponent}
                  spaces={teamState.team?.spaces}
                />
              );
            })}
          </div>
        </TabPane>
        <TabPane tab="Spaces" key="3">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Documents</th>
                <th scope="col">Created By</th>
                <th scope="col">Last modified</th>
              </tr>
            </thead>
            <tbody>
              {teamState.team.spaces?.map((space, index) => {
                console.log('spaces here: ', space)
                const newTo = {
                  pathname: `/dashboard/spaces/${space._id}`,
                  paramSpace: sideComponent.param1,
                };
                return (
                  <tr key={space._id}>
                    <th scope="row">{index + 1}</th>
                    {/* <td onClick={() => history.replace(`/dashboard/spaces/${space._id}`)}>{space.name}</td> */}
                    <td>
                      <Link to={newTo}>{space.name}</Link>
                    </td>
                    <td>{space.boards?.length}</td>
                    <td>{space.createdBy?.name}</td>
                    <td>
                      {new Date(space.updatedAt).toLocaleTimeString("en-EN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        // second: '2-digit',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TeamResult;
