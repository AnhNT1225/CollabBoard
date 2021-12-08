import React, { useState, useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { Dropdown, Card, Row, Col, Modal, Select, Button, message } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import ItemOptions from "./ItemOptions";
import "./styles.scss";
import SpaceService from "../../services/spaceService";

import BoardService from "../../services/boardService";
import {TeamContext} from "../../context/teamContext";
import { getUserId } from "../../lib/auth";
const { Option } = Select;
const ItemCards = ({ board, index, spaces, socket, sideComponent }) => {
  const history = useHistory();
  const [spaceSelectionModal, setSpaceSelectionModal] = useState(false);
  const { teamDispatch } = useContext(TeamContext);
  // const socketRef = useRef(null);
  const userId = getUserId();
  const spaceVal = useRef(null);
  const spaceId = useRef(null);
  function changeStorePosition(value, e) {
    console.log(`selected ${value}`);
    console.log("e: ", e);
    spaceId.current = e.name;
    spaceVal.current = value;
  }

  const submitStorePositiion = async (e) => {
    try {
      e.preventDefault();
      // const inputData = {
      // 	name: spaceVal.current,
      // 	boardId: board._id,
      // };
      // await BoardService.setSpaceForBoard(board._id, spaceId.current)
      //   .then((result) => {
      //     console.log("result 1: ", result);
      //     boardDispatch({ type: "UPDATE_BOARDS_INFO", payload: result.data });
      //   })
      //   .catch((error) => {
      //     console.log("error: ", error);
      //   //   throw new Error("The board haven't add to the space.");
      //   });
      await SpaceService.addBoardToSpace(spaceId.current, board._id)
        .then((result) => {
          console.log("result 2: ", result.data);
          message.success(`Add board successfully into space named ${result.data.name}!`);
          // teamDispatch({type: 'UPDATE_TEAM_BOARDS', payload: result.data})
        })
        .catch((error) => {
          console.log("error: ", error);
        //   throw new Error("The board haven't add to the space.");
        });
      setSpaceSelectionModal(false);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleOpenRoom = (e) => {
    e.preventDefault();
    // socketDispatch({ type: "JOIN_ROOM", payload: board.code });
    socket?.emit("create-room", board.code);
    history.push(`/board/${board._id}`);
  };

  let base64ImageString = Buffer.from(board.imageURL, "binary").toString(
    "base64"
  );
  return (
    <>
      <Card
        key={index}
        className="item"
        style={{ borderRadius: 10 }}
        // bordered
        bodyStyle={{ padding: "10px 15px" }}
        hoverable
        cover={
          <img
            className="board_media"
            alt="example"
            src={`data:image/png;base64,${base64ImageString}`}
            height={200}
            width={500}
            style={{ borderRadius: 10, border: "1px solid gray", padding: 5 }}
            onClick={handleOpenRoom}
          />
        }
      >
        <div className="item_description">
          <div className="item_info">
            <Link className="card_title" to={`/board/${board?._id}`}>
              {board?.name}
            </Link>
          </div>
          <Row>
            <Col span={12}>
              {board.spaceId?._id ? (
                <Link to={`/dashboard/spaces/${board.spaceId?._id}`}>
                  {board.spaceId?.name}
                </Link>
              ) : (
                <>
                  {board?.createdBy === userId || board.createdBy?._id === userId? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ width: "10rem" }}
                      onClick={(e) => {
                        setSpaceSelectionModal(true);
                      }}
                    >
                      + Add to space
                    </button>
                   ) : null} 
                </>
              )}
            </Col>
            <Col span={12}>
              <Dropdown.Button
                className="detail_dropdown"
                placement="topLeft"
                trigger={["click"]}
                overlay={
                  <ItemOptions
                    createdBy={board?.createdBy}
                    boardCode={board?.code}
                    boardId={board?._id}
                    spaceId={board.spaceId?._id}
                    sideComponent={sideComponent}
                  />
                }
                type="text"
                size="large"
                icon={<MoreOutlined style={{ fontSize: 25 }} />}
                // onClick={(e) => {e.stopPropagation()}}
              />
            </Col>
          </Row>
        </div>
      </Card>
      <Modal
        title="Choose location for store board"
        style={{ textAlign: "center" }}
        centered
        visible={spaceSelectionModal}
        onOk={() => setSpaceSelectionModal(false)}
        onCancel={() => setSpaceSelectionModal(false)}
        zIndex={1000}
        footer={null}
        keyboard
        destroyOnClose={true}
      >
        <form onSubmit={submitStorePositiion}>
          <label>Current Space: </label>{" "}
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a space"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
            onChange={changeStorePosition}
          >
            {spaces &&
              spaces.map((space) => (
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
    </>
  );
};

export default ItemCards;
