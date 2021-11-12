import React from "react";
import moment from "moment";
import "./message.scss";
import { getUserId } from "../../lib/auth";

const Message = (props) => {
  const { message } = props;
  console.log('message: ', message);
  const userId = getUserId();

  console.log('sender.id: ', message.senderId?._id)
  return (
    <div className="message">
      <div className="messageTop">
        {message.senderId?._id === userId ? (
          <b className="messageOwner"> You </b>
        ) : (
          <b className="messageOwner"> {message.senderId?.name} </b>
        )}
        <div className="messageTime">{moment(message?.createdAt).fromNow()} </div>
      </div>
      <div className="messageBottom">
        <p className="messageText">{message?.message}</p>
      </div>
    </div>
  );
};

export default Message;
