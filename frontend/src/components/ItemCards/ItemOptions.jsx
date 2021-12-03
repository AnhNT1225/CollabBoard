import React, { useContext } from "react";
import { Menu, Popconfirm, message } from "antd";
import { BoardContext } from "../../context/boardContext";
import BoardService from "../../services/boardService";
import SpaceService from "../../services/spaceService";
import { SpaceContext } from "../../context/spaceContext";
import "./styles.scss";
import MessageService from "../../services/messageService";
const ItemOptions = (props) => {
  const { boardId, spaceId, boardCode } = props;
  console.log("board ID of selected card: ", boardId);
  const { boardDispatch } = useContext(BoardContext);
  const { spaceDispatch } = useContext(SpaceContext);
  const confirm = async (e) => {
    e.preventDefault();
    //delete board
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

    await MessageService.deleteMessages(boardId)
      .then(async (response) => {
        console.log("delete message: ", response);
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  };

  const cancel = (e) => {
    e.preventDefault();
  };

  const handleMenuClick = async (e) => {
    console.log("click", e.key);
    switch (e.key) {
      case "1":
        //remove board from boards array in spaces first
        await SpaceService.removeBoardFromSpace(spaceId, boardId)
          .then(async (response) => {
            console.log("remove from space response: ", response);
            spaceDispatch({
              type: "UPDATE_SPACE",
              payload: response.data,
            });
          })
          .catch((error) => {
            console.log("err: ", error);
          });
        // await BoardService.removeBoardFromSpace(spaceId, boardId)
        //   .then(async (response) => {
        //     console.log("remove from space response: ", response);
        //     spaceDispatch({
        //       type: "UPDATE_SPACE",
        //       payload: response.data,
        //     });
        //   })
        //   .catch((error) => {
        //     console.log("err: ", error);
        //   });
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
  };
  return (
    <>
      <Menu onClick={handleMenuClick}>
        {spaceId ? <Menu.Item key="1" className="item_class">
          <i className="fas fa-box"></i>
          <span> Remove from space</span>
        </Menu.Item> : null}
        
        <Menu.Item key="2" danger className="item_class">
          <Popconfirm
            title="Are you sure to delete this board?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <i className="far fa-trash-alt"></i>
            <span> Remove</span>
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
