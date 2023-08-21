import React, { useContext, useEffect, useRef } from "react";
import { auth } from "../../firebase/config";
import { ChatContext } from "./ChatContext";

const Message = ({ message }) => {
  const currentUser = auth.currentUser;
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // Check if the message text is empty
  const isTextEmpty = !message.text || message.text.trim().length === 0;

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
      </div>
      <div className="messageContent">
        {/* Render the message text only if it's not empty */}
        {isTextEmpty ? null : <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
