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
import {TeamContext} from '../../../context/teamContext'
import SpaceService from "../../../services/spaceService";
const { TabPane } = Tabs;
const { Option } = Select;
const TeamResult = (props) => {
  const teamId = props.match.params.teamId;
  const [team, setTeam] = useState(null);
  const { boardState, boardDispatch } = useContext(BoardContext);
  const { spaceState, spaceDispatch } = useContext(SpaceContext);
  const {teamContext, teamDispatch} = useContext(TeamContext)
  const [boardSelectionModal, setBoardSelectionModal] = useState(false);
  const [spaceSelectionModal, setSpaceSelectionModal] = useState(false);

  const emailRef = useRef(null);
  const boardId = useRef(null);
  const spaceId = useRef(null);
  const time = new Date(team?.createdAt).toLocaleDateString("en-EN", {
    day: "numeric",
    month: "short",
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
          setTeam(result.data);
        })
        .catch((err) => {
          throw new Error(err);
        });
    };
    getTeamInfo();
  }, [teamId]);

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
  // const createNewSpace = async (e) => {
  //   e.preventDefault();
  //   await SpaceService.createSpace(spaceName)
  //     .then((result) => {
  //       console.log("result: ", result);
  //       spaceDispatch({ type: "CREATE_SPACE", payload: result.space });
  //       message.success(result.message);
  //     })
  //     .catch((error) => {
  //       console.log("error: ", error);
  //     });
  //   await setSpaceName(null);
  //   setCreateSpaceModal(false);
  // };

  const inviteMember = async (e) => {
    e.preventDefault();
    await TeamService.addMemberToTeam(teamId, emailRef.current)
      .then((result) => {
        console.log("add member to team result: ", result);
        teamDispatch({type: "FETCH_TEAM_SUCCESS", payload: result.data});
      })
      .catch((error) => {
        console.log("error: ", error);
        throw new Error("The space haven't add to the team.");
      });
  };
  //----------------------------------------------------------------
  const changeSpaceSelection = async (value, e) => {
    console.log("e: ", e);
    console.log("value: ", value);
    spaceId.current = await e.key;
  };

  const changeBoardSelection = async (value, e) => {
    console.log("e: ", e);
    console.log("value: ", value);
    boardId.current = await e.key;
  };

  const submitSpace = async (e) => {
    try {
      e.preventDefault();
      await SpaceService.setTeamForSpace(spaceId.current, teamId)
        .then((result) => {
          console.log("set teamId to Space result: ", result);
        })
        .catch((error) => {
          console.log("error: ", error);
          throw new Error("The teamId haven't set to the space.");
        });

      await TeamService.addSpaceToTeam(teamId, spaceId.current)
        .then((result) => {
          console.log("add space to Team spaces[] result: ", result);
        })
        .catch((error) => {
          console.log("error: ", error);
          throw new Error("The space haven't add to the team.");
        });
      setSpaceSelectionModal(false);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const submitBoard = async (e) => {
    try {
      e.preventDefault();
      await TeamService.addBoardToTeam(teamId, boardId.current)
        .then((result) => {
          console.log("add board to team result: ", result);
        })
        .catch((error) => {
          console.log("error: ", error);
          throw new Error("The board haven't add to the team.");
        });
      setBoardSelectionModal(false);
    } catch (error) {
      console.log("error: ", error);
    }
  };

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
          <b>{team?.name}</b>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="team_result_wrap">
        <div className="team_info">
          <h1>Team : {team?.name}</h1>
          <span>Total Member: {team?.members.length}</span>
          <p>Created At: {time}</p>
          <b>Host: {team?.createdBy.name}</b>
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
                setBoardSelectionModal(true);
              }}
            >
              Add existed board
            </Button>
            <Modal
              title="Choose board"
              style={{ textAlign: "center" }}
              centered
              visible={boardSelectionModal}
              onOk={() => setBoardSelectionModal(false)}
              onCancel={() => setBoardSelectionModal(false)}
              zIndex={1000}
              footer={null}
              keyboard
            >
              <form onSubmit={submitBoard}>
                <label>Current Board: </label>{" "}
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select a board"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                  onChange={changeBoardSelection}
                >
                  {boardState?.boards.map((board) => (
                    <Option key={board._id} value={board.name} name={board._id}>
                      {board.name}
                    </Option>
                  ))}
                </Select>
                <br />
                <br />
                <Button type="primary" htmlType="submit">
                  Insert
                </Button>
              </form>
            </Modal>
          </div>
        ) : tab === "3" ? (
          <div className="team_actions">
            <Button onClick={() => setSpaceSelectionModal(true)}>
              Add existed space
            </Button>
            <Modal
              title="Choose Space"
              // bodyStyle={{ padding: "2rem", height: 300 }}
              style={{ textAlign: "center" }}
              centered
              visible={spaceSelectionModal}
              onOk={() => setSpaceSelectionModal(false)}
              onCancel={() => setSpaceSelectionModal(false)}
              footer={null}
              keyboard
            >
              <form onSubmit={submitSpace}>
                <label>Current Space: </label>{" "}
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select a board"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                  onChange={changeSpaceSelection}
                >
                  {spaceState?.spaces.map((space) => (
                    <Option key={space._id} value={space.name} name={space._id}>
                      {space.name}
                    </Option>
                  ))}
                </Select>
                <br />
                <br />
                <Button type="primary" htmlType="submit">
                  Insert
                </Button>
              </form>
            </Modal>
          </div>
        ) : (
          <div className="team_actions">
            <Button>View chat history</Button>
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
                {team?.members.map((mem) => {
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
                              {mem.name.charAt(0)}
                            </span>
                          </Avatar>
                          <div className="member_info">
                            <span className="member_name">{mem.name} </span>
                            {team?.createdBy.name === mem.name ? (
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
            {team?.boards.map((board, index) => {
              return <ItemCards key={index} board={board} />;
            })}
          </div>
        </TabPane>
        <TabPane tab="Spaces" key="3">
          <table class="table">
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
              {team?.spaces.map((space, index) => {
                return (
                  <tr key={space._id}>
                    <th scope="row">{index}</th>
                    <td>{space.name}</td>
                    <td>{space.boards.length}</td>
                    <td>{space.createdBy.name}</td>
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
