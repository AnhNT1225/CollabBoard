import React, { useEffect, useState, useRef } from "react";
import { Button, Tooltip } from "antd";
import { CloseOutlined, SendOutlined } from "@ant-design/icons";
import { socket } from "../../services/socketServices";
import MessageService from "../../services/messageService";
import "./conversation.scss";
import Message from "../Message/Message";
const Conversation = (props) => {
  const { setIsChatOpen, user, boardId } = props;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        senderId: data.senderId,
        message: data.message,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      await MessageService.getMessage(boardId)
        .then((response) => {
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
    e.preventDefault();

    await MessageService.addNewMessage(boardId, newMessage)
      .then(async (response) => {
        console.log("response message: ", response);
        const message = {
          senderId: response.senderId,
          message: response.message,
        };
        await socket.emit("sendMessage", message);
        setMessages([...messages, response]);
        setNewMessage("");
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            onClick={() => setIsChatOpen(false)}
          />
        </Tooltip>
      </div>
      <div className="chatbox_wrap">
        {messages.map((m) => {
          console.log("all message in boards: ", m);
          return (
            <div ref={scrollRef}>
              <Message key={m._id} message={m} user={user} />
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
  );
};

export default Conversation;
