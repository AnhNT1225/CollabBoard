import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Breadcrumb,
  Button,
  Tag,
  Tabs,
  Modal,
  Select,
  Avatar,
  message,
  Input,
} from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import TeamService from "../../../services/teamService";
import ItemCards from "../../ItemCards/ItemCard";
import { BoardContext } from "../../../context/boardContext";
import BoardService from "../../../services/boardService";
import { SpaceContext } from "../../../context/spaceContext";
import { TeamContext } from "../../../context/teamContext";
import SpaceService from "../../../services/spaceService";
const { TabPane } = Tabs;
const { Option } = Select;
const TeamResult = (props) => {
  const teamId = props.match.params.teamId;
  // const [team, setTeam] = useState(null);
  const { boardDispatch } = useContext(BoardContext);
  const { spaceDispatch } = useContext(SpaceContext);
  const { teamState, teamDispatch } = useContext(TeamContext);
  // const [boardSelectionModal, setBoardSelectionModal] = useState(false);
  const [createSpaceModal, setCreateSpaceModal] = useState(false);
  const [createBoardModal, setCreateBoardModal] = useState(false);

  const emailRef = useRef(null);
  const [boardName, setBoardName] = useState('');
  const [spaceName, setSpaceName] = useState('');

  const time = new Date(teamState?.team.createdAt).toLocaleDateString("en-EN", {
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
    const getTeamInfo = async () => {
      await TeamService.getTeamById(teamId)
        .then((result) => {
          console.log("result team : ", result);
          teamDispatch({ type: "FETCH_TEAM_SUCCESS", payload: result.data });
        })
        .catch((err) => {
          throw new Error(err);
        });
    };
    getTeamInfo();
  }, []);

  useEffect(() => {
    boardDispatch({ type: "FETCH_BOARDS_REQUEST" });
    BoardService.getOwnedBoard()
      .then(async (response) => {
        console.log("response at board: ", response.data);
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
        console.log("response at space: ", response.data);
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
  const changeSpaceName = async (e) => {
    const name = e.target.value;
    console.log("space name: ", name);
    setSpaceName(name);
  };

  const changeBoardName = async (e) => {
    const name = e.target.value;
    console.log("space name: ", name);
    setBoardName(name);
  };
  const createNewSpace = async (e) => {
    e.preventDefault();
    await SpaceService.createSpace(spaceName)
      .then((result) => {
        console.log("result: ", result);
        spaceDispatch({ type: "CREATE_SPACE", payload: result.space });
        message.success(result.message);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
      setCreateSpaceModal(false);
    await TeamService.addSpaceToTeam(teamId, spaceName)
      .then((result) => {
        console.log("add space to team result: ", result);
        teamDispatch({ type: "FETCH_TEAM_SUCCESS", payload: result.data });
      })
      .catch((error) => {
        console.log("error: ", error);
        if(error){
          throw new Error("The space haven't add to the team.");
        }
      });
    setSpaceName('');
  };

  const createNewBoard = async (e) => {
    e.preventDefault();
    await BoardService.createBoard(boardName)
      .then((result) => {
        console.log("result: ", result);
        boardDispatch({ type: "CREATE_BOARD", payload: result.board });
        message.success(result.message);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
      setCreateBoardModal(false);
    await TeamService.addBoardToTeam(teamId, boardName)
      .then((result) => {
        console.log("add board to team result: ", result);
        teamDispatch({ type: "FETCH_TEAM_SUCCESS", payload: result.data });
      })
      .catch((error) => {
        console.log("error: ", error);
        if(error){
          throw new Error("The board haven't add to the team.");
        }
      });
    setBoardName('');
  };

  const inviteMember = async (e) => {
    e.preventDefault();
    await TeamService.addMemberToTeam(teamId, emailRef.current)
      .then((result) => {
        console.log("add member to team result: ", result);
        teamDispatch({ type: "FETCH_TEAM_SUCCESS", payload: result.data });
      })
      .catch((error) => {
        console.log("error: ", error);
        if (error) {
          throw new Error("Failed to add new member to the team.");
        }
      });
  };
  //----------------------------------------------------------------

  const viewChat = () => {};

  // const submitBoard = async (e) => {
  //   try {
  //     e.preventDefault();
  //     await TeamService.addBoardToTeam(teamId, boardId.current)
  //       .then((result) => {
  //         console.log("add board to team result: ", result);
  //         teamDispatch({ type: "FETCH_TEAM_SUCCESS", payload: result.data });
  //       })
  //       .catch((error) => {
  //         console.log("error: ", error);
  //         throw new Error("The board haven't add to the team.");
  //       });
  //       setCreateBoardModal(false);
  //   } catch (error) {
  //     console.log("error: ", error);
  //   }
  // };

  //-------------------------------Return-----------------------------------------
  return (
    <div>
      <Breadcrumb>
        <Link to={"/"}>
          <Breadcrumb.Item>
            <HomeOutlined />
          </Breadcrumb.Item>
        </Link>
        <Link to={"/dashboard"}>
          <Breadcrumb.Item>
            <span>Dashboard</span>
          </Breadcrumb.Item>
        </Link>
        <Link to={"/dashboard/teams"}>
          <Breadcrumb.Item>
            <span>Teams</span>
          </Breadcrumb.Item>
        </Link>
        <Breadcrumb.Item>
          <b>{teamState.team?.name}</b>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="team_result_wrap">
        <div className="team_info">
          <h1>Team : {teamState.team?.name}</h1>
          <span>Total Member: {teamState.team.members?.length}</span>
          <p>Created At: {time}</p>
          <b>Host: {teamState.team.createdBy?.name}</b>
        </div>

        {tab === "1" ? (
          <div className="team_actions">
            <Button>View chat history</Button>
          </div>
        ) : tab === "2" ? (
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
            >
              <form className="room_code_wrapper" onSubmit={createNewBoard}>
                <label className="room_code_label">New board name</label>
                <br />
                <Input
                  style={{ width: 250, height: 40, textAlign: "center" }}
                  value={boardName}
                  onChange={changeBoardName}
                />
                <br />
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  style={{ width: 100, borderRadius: 5, fontWeight: "bold" }}
                >
                  Create
                </Button>
              </form>
            </Modal>
          </div>
        ) : tab === "3" ? (
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
            >
              <form className="room_code_wrapper" onSubmit={createNewSpace}>
                <label className="room_code_label">Space name</label>
                <br />
                <Input
                  style={{ width: 250, height: 40, textAlign: "center" }}
                  value={spaceName}
                  onChange={changeSpaceName}
                />
                <br />
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  style={{ width: 100, borderRadius: 5, fontWeight: "bold" }}
                >
                  Create
                </Button>
              </form>
            </Modal>
          </div>
        ) : (
          <div className="team_actions">
            <Button onClick={viewChat}>View chat history</Button>
          </div>
        )}
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
                onChange={(e) => (emailRef.current = e.target.value)}
              />
              <Button htmlType="submit">Invite</Button>
            </form>
            <table class="table table-hover">
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
              return <ItemCards key={index} board={board} />;
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
                return (
                  <tr key={space._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{space.name}</td>
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
