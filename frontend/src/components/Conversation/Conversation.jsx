import React, { useEffect, useState, useRef } from "react";
import { Button, Tooltip } from "antd";
import { CloseOutlined, SendOutlined } from "@ant-design/icons";
import MessageService from "../../services/messageService";
import "./conversation.scss";
import Message from "../Message/Message";
const Conversation = (props) => {
  const { setIsChatOpen, user, boardId, socket, boardCode, setIsButton } = props;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  console.log("boardCode: ", boardCode);
  useEffect(() => {
    socket?.on("receiveMessageServer", (data) => {
      setArrivalMessage({
        senderId: data.message.senderId,
        message: data.message.message,
        createdAt: new Date(Date.now()).toISOString(),
      });
    });
  }, [socket]);

  useEffect(() => {
    const getMessages = async () => {
      await MessageService.getMessage(boardId)
        .then((response) => {
          console.log("GET MESS: ", response);
          setMessages(response.data);
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    };
    getMessages();
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  const sendMessage = async (e) => {
    await MessageService.addNewMessage(boardId, newMessage)
      .then(async (response) => {
        console.log("response message: ", response);
        const message = {
          senderId: {
            _id: response.data.senderId._id,
            name: response.data.senderId.name,
          },
          message: response.data.message,
        };
        await socket?.emit("sendMessageClient", {
          code: boardCode,
          message: message,
        });
        setMessages([...messages, response.data]);
        setNewMessage("");
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClose = () => {
    setIsChatOpen(false);
    setIsButton(true);
  }
  return (
    <div className="chat_box">
      <div className="chatbox_title_wrap">
        <h3 className="chatbox_title">Chat Box</h3>
        <Tooltip title="Close" placement="bottom">
          <Button
            className="chatbox_close"
            type="text"
            shape="circle"
            icon={<CloseOutlined style={{ fontSize: 20 }} />}
            onClick={handleClose}
          />
        </Tooltip>
      </div>
      <div className="chatbox_wrap">
        {messages?.map((m) => {
          console.log("all message in boards: ", m);
          return (
            <div ref={scrollRef}>
              <Message key={m._id} message={m} />
            </div>
          );
        })}
      </div>
      <div className="chatbox_footer">
        <textarea
          className="input_btn"
          placeholder="Send message to everyone"
          rows="2"
          cols="40"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <div className="send_wrap">
        <Button
          className="send_btn"
          htmlType="button"
          shape="circle"
          size="large"
          icon={
            <SendOutlined
              className="send-icon"
              style={{
                fontSize: 25,
                color: "white",
              }}
            />
          }
          onClick={sendMessage}
        />
        </div>
      </div>
    </div>
  );
};

export default Conversation;
