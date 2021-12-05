import React, { useRef, useContext } from "react";
import { Modal, Input, Button, message, Form } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Logo from "../Logo";
import { BoardContext } from "../../context/boardContext";
import BoardService from "../../services/boardService";
import { useHistory } from "react-router-dom";
import { getUserName } from "../../lib/auth";
const JoinRoomModal = (props) => {
  const { joinRoomModal, setjoinRoomModal, setCreateBoardModal, socket } =
    props;
  const { boardState, boardDispatch } = useContext(BoardContext);

  const history = useHistory();
  // const inputRef = useRef(null);
  // console.log("test JoinRoomModal : ", joinRoomModal);
  const backToPrevious = () => {
    setjoinRoomModal(false);
    setCreateBoardModal(true);
  };

  const handleJoinRoom = async (form) => {
    // e.preventDefault();
    await BoardService.findBoardByCode(form.codeInput)
      .then(async (result) => {
        console.log("result from join lomeo: ", result);
        const memberInfo = {
          memberName: getUserName(),
          //   receiver: result.data.createdBy.id,
          type: 1,
        };
        await socket?.emit("join-room", result.data.code, memberInfo);
        await boardDispatch({
          type: "SET_CURRENT_BOARD",
          payload: result.data,
        });

        // message.success(`You have joined the room: ${result.data.code}`)
        history.push(`/board/${result.data._id}`);
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  };

  return (
    <Modal
      visible={joinRoomModal}
      footer={null}
      onOk={() => setjoinRoomModal(false)}
      onCancel={() => setjoinRoomModal(false)}
      title={<ArrowLeftOutlined onClick={backToPrevious} />}
      destroyOnClose={true}
    >
      <Form
        className="room_code_wrapper"
        onFinish={handleJoinRoom}
        scrollToFirstError
        autoComplete="off"
      >
        <Logo />
        <section className="room_code_description">
          <b>Collaborate with others via Collab Board.</b>
          <p>
            Web participants of a <b>collaborative </b>session are able to{" "}
            <b>draw</b>, make <b> comments</b>, and <b>share</b> their ideas in{" "}
            <b>real-time</b>.
          </p>
        </section>
        <label className="room_code_label">
          <b>ENTER THE CODE TO JOIN A SESSION</b>
        </label>
        <Form.Item
          name="codeInput"
          rules={[
            {
              required: true,
              message: "Please input your board code!",
            },
            { whitespace: true, message: "Please enter some characters" },
          ]}
          hasFeedback
        >
          <Input
            // ref={inputRef}
            style={{ width: 250, height: 50, textAlign: "center" }}
            placeholder="ENTER invite code"
            // onChange={(e) => (inputRef.current = e.target.value)}
          />
        </Form.Item>
        <br />
        <Button
          htmlType="submit"
          type="primary"
          size="large"
          style={{ width: 200, borderRadius: 20, fontSize: " 1rem " }}
        >
          Join
        </Button>
      </Form>
    </Modal>
  );
};

export default JoinRoomModal;
