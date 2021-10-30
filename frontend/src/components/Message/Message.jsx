import React from "react";
import "./message.scss";

const Message = (props) => {
  const { message, user } = props;
  //transfer ISO time to Date data
  const localDate = new Date(message.createdAt);
  console.log("createdAt: ", localDate);
  //transfer to LocaleTime VN
  const localTimeString = localDate.toLocaleTimeString("en-EN", {
    hour: "2-digit",
    minute: "2-digit",
    // second: '2-digit',
  });
  const nowDate = Date.now();
  console.log("nowDate: ", nowDate);

  // const hours = new Date (message.createdAt).getUTCHours();
  // const minutes = new Date (message.createdAt).getUTCMinutes();
  // const startDate = new Date (message.createdAt)
  // const endDate = new Date(Date.now());
  // console.log('start: ', startDate)
  // console.log('end: ', endDate)
  // const currentDate = endDate.getTime() - startDate.getTime();
  // console.log("transferHours: ", currentDate);
  return (
    <div className="message">
      <div className="messageTop">
        {message.senderId._id === user._id ? (
          <b className="messageOwner"> You </b>
        ) : (
          <b className="messageOwner"> {message.senderId.name} </b>
        )}
        <div className="messageTime">{`${localTimeString}`} </div>
      </div>
      <div className="messageBottom">
        <p className="messageText">{message.message}</p>
      </div>
    </div>
  );
};

export default Message;
