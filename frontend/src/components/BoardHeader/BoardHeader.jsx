import React, { useState, useContext } from "react";
import {
  Menu,
  Dropdown,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
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
import { useEffect } from "react";
import ColorPicker from "../ColorPicker/ColorPicker";
import LineWeight from "../LineWeight/LineWeight";
import { downloadURI, ToStringBase64 } from "../../lib/process_img";
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
    boardState, boardDispatch,
    socket
  } = props;
  // const { boardState, boardDispatch } = useContext(BoardContext);
  const {elementDispatch} = useContext(ElementContext)
  const [text, setText] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [color, setColor] = useState(drawingProperty.brushColor);
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

  // useEffect(() => {
  //   boardDispatch({ type: "FETCH_BOARDS_REQUEST" });
  //   BoardService.getBoard(boardId)
  //     .then((response) => {
  //       console.log("response at board header: ", response);
  //       boardDispatch({
  //         type: "FETCH_CURRENT_BOARD_SUCCESS",
  //         payload: response.data,
  //       });
  //     })
  //     .catch((error) => {
  //       console.log("err: ", error);
  //     });
  //   return () => {
  //     boardDispatch({ type: "FETCH_DATA_FAILURE" });
  //   };
  // }, []);

  useEffect(() => {
    
    if (boardState.currentBoard) {
      console.log('test boardState: ', boardState.currentBoard)
      console.log('test contributors: ', boardState.currentBoard.contributors)
      setText(boardState.currentBoard.name);
      setContributors(boardState.currentBoard.contributors);
    }
  }, [boardState]);

  const updateName = async (e) => {
    console.log("e: ", e);
    const newBoardName = await e;
    setText(e);
    await BoardService.updateBoardName(boardId, newBoardName)
      .then(async(response) => {
        console.log("Board updated name info: ", response.data);
        await boardDispatch({ type: "SET_CURRENT_BOARD", payload: response.data });
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  };


  async function handleSettingMenu(e) {
    console.log("click", e);
    const item = e.key;
    switch (item) {
      case "1":
        <h1>Hello2</h1>;
        break;
      case "2":
        let base64ImageString = Buffer.from(boardState.currentBoard?.imageURL, "binary").toString(
          "base64"
        );
        // let base64ImageString = await ToStringBase64(boardState.currentBoard?.imageURL)
        console.log('BASE 64 STRING: ', base64ImageString)
        downloadURI(`data:image/png;base64,${base64ImageString}`, `${boardState.currentBoard?.name}.png`)
        break;
      case "3":
        <h1>Hello3</h1>;
        break;
      default:
        break;
    }
  }
  //Menu component ant design for DropDown Menu

  const menu1 = (
    <Menu onClick={handleSettingMenu}>
      <Menu.Item key="1">View history version</Menu.Item>
      <Menu.Item key="2">Export to image</Menu.Item>
      <Menu.Item key="3">View comment</Menu.Item>
    </Menu>
  );

  const backToDashboard = async (e) => {
    e.preventDefault();
    elementDispatch({ type: "RESET_STATE" });
    const codeRoom = await boardState.currentBoard?.code;
    await socket?.emit("leave-room", codeRoom);
    history.goBack(1);
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
              <ShapingOptions boardCode={boardState.currentBoard?.code}/>
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
                  <Tooltip
                    key={index}
                    title={`${user?.name}`}
                    placement="top"
                  >
                    <Avatar>{user?.name.charAt(0)}</Avatar>
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
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: 18 }} />}
          ></Button>
        </div>
      </header>
    </>
  );
};

export default BoardHeader;
