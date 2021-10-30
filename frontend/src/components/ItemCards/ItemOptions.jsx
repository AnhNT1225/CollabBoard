import React, { useContext } from "react";
import { Menu, Popconfirm, message } from "antd";
import { BoardContext } from "../../context/boardContext";
import BoardService from "../../services/boardService";
import SpaceService from "../../services/spaceService";
import "./styles.scss";
const ItemOptions = (props) => {
  const { boardId, spaceId, boardCode } = props;
  // console.log("board ID of selected card: ", boardId);
  const { boardDispatch } = useContext(BoardContext);

  const confirm = async (e) => {
    e.preventDefault();
    await BoardService.deleteBoard(boardId)
      .then(async (response) => {
        console.log("delete response: ", response);
        boardDispatch({
          type: "REMOVE_BOARD",
          payload: boardId,
        });
      })
      .catch((error) => {
        console.log("err: ", error);
      });

    await SpaceService.removeBoardFromSpace(spaceId, boardId)
      .then(async (response) => {
        console.log("romove from space response: ", response);
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  };

  const cancel = (e) => {
    e.preventDefault();
  };

  function handleMenuClick(e) {
    console.log("click", e.key);
    switch (e.key) {
      case "1":
        console.log("HELLOO WORLDDD ");
        break;
      case "3":
        console.log("boardCode: ", boardCode);

        navigator.clipboard.writeText(boardCode);
        /* Alert the copied text */
        message.success({
          content: "Copied the board code to clipboard",
        });
        break;
      default:
        break;
    }
  }
  return (
    <>
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="1" className="item_class">
          <i className="fas fa-box"></i>
          <span> Move</span>
        </Menu.Item>
        <Menu.Item key="2" danger className="item_class">
          <Popconfirm
            title="Are you sure to delete this board?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <i className="far fa-trash-alt"></i>
            <span>  Remove</span>
          </Popconfirm>
        </Menu.Item>
        <Menu.Item key="3" className="item_class">
          <i className="far fa-share-square"></i>
          <span> Get shared key</span>
        </Menu.Item>
      </Menu>
    </>
  );
};

export default ItemOptions;
