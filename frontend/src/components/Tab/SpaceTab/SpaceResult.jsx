import React, { useEffect, useState, useContext, useRef } from "react";
import { Breadcrumb, Button, Empty, Modal, Select, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import SpaceService from "../../../services/spaceService";
import { SpaceContext } from "../../../context/spaceContext";
import { BoardContext } from "../../../context/boardContext";
import BoardService from "../../../services/boardService";
import ItemCards from "../../ItemCards/ItemCard";
import "./styles.scss";
const { Option } = Select;
const SpaceResult = (props) => {
  const spaceId = props.match.params.spaceId;
  const history = useHistory();
  // const [space, setSpace] = useState(null);
  const { boardState, boardDispatch } = useContext(BoardContext);
  const { spaceState, spaceDispatch } = useContext(SpaceContext);
  const [boardSelectionModal, setBoardSelectionModal] = useState(false);
  const boardId = useRef(null);

  const time = new Date(spaceState.space?.createdAt).toLocaleDateString(
    "en-EN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  useEffect(() => {
    const getSpaceInfo = async () => {
      await SpaceService.getSpaceById(spaceId)
        .then((result) => {
          console.log("result space : ", result);
          spaceDispatch({ type: "FETCH_SPACE_SUCCESS", payload: result.data });
        })
        .catch((err) => {
          throw new Error(err);
        });
    };
    getSpaceInfo();
  }, [spaceDispatch]);

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

  const changeBoardSelection = async (value, e) => {
    console.log("e: ", e);
    console.log("value: ", value);
    boardId.current = await e.key;
  };

  const submitBoard = async (e) => {
    try {
      e.preventDefault();
      // await BoardService.setSpaceForBoard(boardId.current, spaceId.current)
      // .then((result) => {
      // 	console.log("result 1: ", result);
      // 	boardDispatch({type: "UPDATE_BOARDS_INFO", payload: result.data})
      // })
      // .catch((error) => {
      // 	console.log("error: ", error);
      // 	throw new Error("The board haven't add to the space.");
      // });

      await SpaceService.addBoardToSpace(spaceId, boardId.current)
        .then((result) => {
          console.log("add board to space result: ", result);
          spaceDispatch({ type: "FETCH_SPACE_SUCCESS", payload: result.data });
        })
        .catch((error) => {
          console.log("error: ", error);
          throw new Error("The board haven't add to the space.");
        });
      setBoardSelectionModal(false);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  console.log("tai soa ko lne: ", spaceState.space.boards?.spaceId);
  const deleteSpace = async (id) => {
    console.log("is that id: ", id);
    spaceDispatch({ type: "DELETE_SPACE", payload: id });
    await SpaceService.deleteSpace(id)
      .then((result) => {
        console.log("result: ", result);
        history.goBack();
        message.success(result.message);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };
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
          <Link to={"/dashboard/spaces"}>
            <span>Spaces</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <b>{spaceState.space?.name}</b>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="space_result_wrap">
        <div className="space_info">
          <h1>{spaceState.space?.name}</h1>
          <span>Total Boards: {spaceState.space.boards?.length}</span>
          <p>Created At: {time}</p>
          <b>Host: {spaceState.space.createdBy?.name}</b>
        </div>
        <div className="space_actions">
          <Button
            onClick={(e) => {
              setBoardSelectionModal(true);
            }}
          >
            <i class="fas fa-pen"></i>
            <span> Add new board</span>
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
            destroyOnClose={true}
          >
            <form onSubmit={submitBoard}>
              <label>Current Board: </label>{" "}
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a board"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
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
          <Button onClick={() => deleteSpace(spaceId)}>
            <i class="far fa-trash-alt"></i>
            <span> Delete</span>
          </Button>
        </div>
      </div>
      <h3>Board list</h3>
      <div className="item_wrap">
        {spaceState.space.boards?.map((board, index) => {
          console.log("boardID: ", board);
          return <ItemCards key={index} board={board} />;
        })}
      </div>
    </div>
  );
};

export default SpaceResult;
