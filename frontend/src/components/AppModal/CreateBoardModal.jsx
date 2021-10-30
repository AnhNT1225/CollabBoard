import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Upload, message } from "antd";
import { useHistory } from "react-router-dom";
import BoardService from "../../services/boardService";
import "./styles.scss";
import JoinRoomModal from "./JoinRoomModal";
// import { SocketContext } from "../../context/socketContext";
import crypto from "crypto";
//media import
import newCanvas from "../../assets/media/blank_canvas.png";
import fileToCanvas from "../../assets/media/upload_file.png";
import enterRoom from "../../assets/media/enter_key.png";
import { socket } from "../../services/socketServices";

const genRandomCode = () => {
  const randomCode = crypto.randomBytes(5).toString("hex");
  console.log("randomCode: ", randomCode);
  return randomCode;
};
const CreateBoardModal = (props) => {
  const history = useHistory();
  // const { socketState, socketDispatch } = useContext(SocketContext);
  const [createBoardModal, setCreateBoardModal] = useState(false);
  const [joinRoomModal, setjoinRoomModal] = useState(false);
  const [file, setFile] = useState({ loading: false });
  // const propsTypes = {
  // 	name: "file",
  // 	// action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  // 	headers: {
  // 		authorization: "authorization-text",
  // 	},
  // 	onChange(info) {
  // 		console.log("info: ", info);
  // 		if (info.file.status !== "uploading") {
  // 			console.log(info.file, info.fileList);
  // 		}
  // 		if (info.file.status === "done") {
  // 			message.success(`${info.file.name} file uploaded successfully`);
  // 		} else if (info.file.status === "error") {
  // 			message.error(`${info.file.name} file upload failed.`);
  // 		}
  // 	},
  // };

  useEffect(() => {
    // socket.on("connect", () => {
    // 	console.log("socket current id: ", socket.id);
    // 	console.log("Successfully connected from client!");
    // });
    const onNotification = (joinData) => {
      console.log("join data: ", joinData);
      // history.push()
      message.success(joinData);
    };
    // // socketDispatch({ type: "NOTIFICATION", action: joinData });
    socket.on("notification", onNotification);
    // return () => {
    // 	socket.off("notification", onNotification);
    // };
	return () => {
		socket.off("notification", onNotification)
	}
  }, []);

  const createBlankBoard = async (e) => {
    const boardCode = await genRandomCode();
    await BoardService.createBoard(boardCode)
      .then(async (response) => {
        console.log("newBoard: ", response.board);
        console.log("socket is something: ", socket);
        await socket.emit("create-room", response.board.code);
        history.push({ pathname: `/board/${response.board._id}` });
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  const createInitialFileBoard = async () => {
    await BoardService.createBoard()
      .then((response) => {
        console.log("newBoard: ", response.board);
        history.push({
          pathname: `/board/${response.board._id}`,
          state: file,
        });
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  const showCodeModal = () => {
    setCreateBoardModal(false);
    setjoinRoomModal(true);
  };

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setFile({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(
        info.file.originFileObj,
        async (imageUrl) =>
          await setFile((prev) => ({
            ...prev,
            imageUrl: imageUrl,
            loading: false,
          }))
      );
    }
  };

  return (
    <div className="content_header">
      <h1 className="title">All prototypes</h1>
      <Button className="create_btn" onClick={() => setCreateBoardModal(true)}>
        + Create
      </Button>
      <Modal
        title="Create prototyping options"
        bodyStyle={{ padding: "2rem", height: 300 }}
        style={{ textAlign: "center" }}
        centered
        visible={createBoardModal}
        footer={null}
        width={1000}
        onOk={() => setCreateBoardModal(false)}
        onCancel={() => setCreateBoardModal(false)}
      >
        <div className="options_container">
          <div className="options_wrap">
            <Button className="option_items" onClick={createBlankBoard}>
              <div className="media_wrap">
                <img
                  className="item_media"
                  src={newCanvas}
                  alt="blank_canvas_media"
                />
              </div>
              <span className="media_name">Blank canvas</span>
            </Button>
            <Button className="option_items" onClick={createInitialFileBoard}>
              <Upload onChange={handleChange}>
                <div className="media_wrap">
                  <img
                    className="item_media"
                    src={fileToCanvas}
                    alt="upload_file_media"
                  />
                </div>
                <span className="media_name">Upload File</span>
              </Upload>
            </Button>
            <Button className="option_items" onClick={showCodeModal}>
              <div className="media_wrap">
                <img
                  className="item_media"
                  src={enterRoom}
                  alt="enter_key_media"
                />
              </div>
              <span className="media_name">Enter room</span>
            </Button>
          </div>
        </div>
      </Modal>
      <JoinRoomModal
        joinRoomModal={joinRoomModal}
        setjoinRoomModal={setjoinRoomModal}
        setCreateBoardModal={setCreateBoardModal}
      />
    </div>
  );
};

export default CreateBoardModal;
