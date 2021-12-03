import React, { useState, useContext, useEffect } from "react";
import {
  Menu,
  Dropdown,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
  Badge,
} from "antd";
import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  BellOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import TextOptions from "../TextOptions";
import ShapingOptions from "../ShapingOptions/ShapingOptions";
import ShareContent from "../ShareContent";
import BoardService from "../../services/boardService";
import { ElementContext } from "../../context/elementContext";
import "./boardheader.scss";
import ColorPicker from "../ColorPicker/ColorPicker";
import LineWeight from "../LineWeight/LineWeight";
import { downloadURI } from "../../lib/process_img";
const { Paragraph } = Typography;

const BoardHeader = (props) => {
  const history = useHistory();
  const {
    boardId,
    menuComponent,
    drawingProperty,
    setDrawingProperty,
    setTextProperty,
    isEditText,
    setIsEditText,
    boardState,
    boardDispatch,
    socket,
  } = props;
  // const { boardDispatch } = useContext(BoardContext);
  const { elementDispatch } = useContext(ElementContext);
  const [text, setText] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [color, setColor] = useState(drawingProperty.brushColor);
  const [notifications, setNotifications] = useState([
    {
      type: 1,
      memberName: "Tuan Anh",
      message: `One people has name Tuan joined our board.`,
    },
  ]);
  const [isOpenNotify, setIsOpenNotify] = useState(false);
  const [lineWeight, setLineWeight] = useState(drawingProperty.brushStroke);
  const drawColors = [
    { name: "red", type: "red" },
    { name: "green", type: "green" },
    { name: "blue", type: "blue" },
    { name: "yellow", type: "yellow" },
    { name: "brown", type: "brown" },
    { name: "pink", type: "pink" },
    { name: "black", type: "black" },
  ];
  useEffect(() => {
    setDrawingProperty((prevState) => ({
      ...prevState,
      brushColor: color,
      brushStroke: lineWeight,
    }));
  }, [color, lineWeight]);

  useEffect(() => {
    const onRoomNotification = (data) => {
      setNotifications((prev) => [...prev, data]);
    };
    socket?.on("getRoomNotification", onRoomNotification);
    return () => {
      socket?.off("getRoomNotification", onRoomNotification);
    };
  }, [socket]);

  // const displayNotification = ({ memberName, type }) => {
  //   let action;
  //   switch (type) {
  //     case 1:
  //       action = "joined";
  //       break;
  //     case 2:
  //       action = "commented";
  //       break;
  //     default:
  //       break;
  //   }
  // };

  useEffect(() => {
    if (boardState.currentBoard) {
      console.log("test boardState: ", boardState.currentBoard);
      console.log("test contributors: ", boardState.currentBoard.contributors);
      setText(boardState.currentBoard.name);
      setContributors(boardState.currentBoard.contributors);
    }
  }, [boardState, contributors]);

  const updateName = async (e) => {
    let isValid = validateInput(e);
    console.log(isValid, "Name: ", e);
    // you validate here
    if (isValid) {
      // this.setState({ e });
      console.log("e: ", e);
      const newBoardName = await e;
      setText(e);
      await BoardService.updateBoardName(boardId, newBoardName)
        .then(async (response) => {
          console.log("Board updated name info: ", response.data);
          await boardDispatch({
            type: "SET_CURRENT_BOARD",
            payload: response.data,
          });
        })
        .catch((error) => {
          console.log("err: ", error);
        });
    }
  };

  async function handleSettingMenu(e) {
    console.log("click", e);
    const item = e.key;
    switch (item) {
      case "1":
        let base64ImageString = Buffer.from(
          boardState.currentBoard?.imageURL,
          "binary"
        ).toString("base64");
        // let base64ImageString = await ToStringBase64(boardState.currentBoard?.imageURL)
        console.log("BASE 64 STRING: ", base64ImageString);
        downloadURI(
          `data:image/png;base64,${base64ImageString}`,
          `${boardState.currentBoard?.name}.png`
        );
        break;
      case "2":
        break;
      case "3":
        await BoardService.leaveBoardById(boardId)
          .then(async (response) => {
            console.log("Board remove: ", response.data);
            await boardDispatch({
              type: "SET_CURRENT_BOARD",
              payload: response.data,
            });
          })
          .catch((error) => {
            console.log("err: ", error);
          });
        socket?.emit("leave-room", boardState.currentBoard?.code);
        history.goBack(1);
        break;
      default:
        break;
    }
  }
  //Menu component ant design for DropDown Menu

  const menu1 = (
    <Menu onClick={handleSettingMenu}>
      <Menu.Item key="1">Export to image</Menu.Item>
      <Menu.Item key="2">View comment</Menu.Item>
      <Menu.Item key="3">Leave room</Menu.Item>
    </Menu>
  );

  const menu = (
    <div
      className="notification_box"
      style={{ inlineSize: 200, wordWrap: "break-word" }}
    >
      {notifications.map((n, i) => (
        <div key={i}>
          <div>
            <p>{n.message}</p>
          </div>
        </div>
      ))}
      <button className="checkBtn" onClick={() => setNotifications([])}>
        Mark as read
      </button>
    </div>
  );

  const backToDashboard = async (e) => {
    e.preventDefault();
    elementDispatch({ type: "RESET_STATE" });
    const codeRoom = await boardState.currentBoard?.code;
    await socket?.emit("leave-room", codeRoom);
    history.goBack(1);
  };

  const validateInput = (text) => {
    const regex = /^[a-zA-Z\\s]+$/;
    return text && regex.test(text);
  };

  return (
    <>
      <header className="editor_header">
        <div className="page_header">
          <Button onClick={backToDashboard}>
            <ArrowLeftOutlined />
            Back to Dashboard
          </Button>
          <Divider type="vertical" style={{ fontSize: 40 }} />
          <div className="project_name_wrap">
            <Tooltip title="Project name">
              <Paragraph
                className="project_name"
                editable={{ onChange: updateName }}
                ellipsis={true}
              >
                {text}
              </Paragraph>
            </Tooltip>
          </div>

          {/* <Button icon={<UndoOutlined />} onClick={handleUndo} />
					<Button icon={<RedoOutlined />} onClick={handleRedo} /> */}
        </div>
        <div className="editor_menu">
          {menuComponent && menuComponent === "drawing" ? (
            <div className="tool_container">
              <ColorPicker mainColors={drawColors} setColor={setColor} />
              <LineWeight setLineWeight={setLineWeight} />
            </div>
          ) : null}
          {menuComponent && menuComponent === "shaping" ? (
            <div className="tool_container">
              <ShapingOptions
                socket={socket}
                boardCode={boardState.currentBoard?.code}
              />
            </div>
          ) : null}
          {menuComponent && menuComponent === "typing" ? (
            <div className="tool_container">
              <TextOptions
                setTextProperty={setTextProperty}
                setIsEditText={setIsEditText}
                isEditText={isEditText}
              />
            </div>
          ) : null}
        </div>
        <div className="setting_container">
          <Dropdown.Button
            className="setting_element"
            trigger={["click"]}
            overlay={menu1}
            icon={<SettingOutlined style={{ fontSize: 18 }} spin="true" />}
            type="text"
          />
          <Avatar.Group
            className="setting_element"
            maxCount={2} // state count = 2 (default) => if a person join into room count +1
            maxStyle={{
              color: "#f56a00",
              backgroundColor: "#fde3cf",
            }}
          >
            {/* using map for users arr to render the user.name and user.avatar */}
            {/* if the user into room is not signin as anymous user with the avatar ? and background color random style, render a div like modal must sign up with GG or email*/}
            {contributors &&
              contributors.map((user, index) => {
                return (
                  <Tooltip key={index} title={`${user?.name}`} placement="top">
                    <Avatar>{user.name?.charAt(0)}</Avatar>
                  </Tooltip>
                );
              })}
          </Avatar.Group>
          <Tooltip className="setting_element" placement="bottom" title="Share">
            <Popover
              placement="bottom"
              content={<ShareContent currentBoard={boardState.currentBoard} />}
              style={{ width: 100 }}
              trigger="click"
            >
              <Button
                type="text"
                icon={<ShareAltOutlined style={{ fontSize: 18 }} />}
              />
            </Popover>
          </Tooltip>
          <Divider type="vertical" />
          <div
            className="notification_wrap"
            style={{
              marginRight: 10,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Badge size="small" count={notifications.length} overflowCount={10}>
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button
                  type="text"
                  icon={
                    <BellOutlined
                      style={{ fontSize: 18 }}
                      // onClick={() => setIsOpenNotify(!isOpenNotify)}
                    />
                  }
                />
              </Dropdown>
            </Badge>
          </div>
        </div>
      </header>
    </>
  );
};

export default BoardHeader;
