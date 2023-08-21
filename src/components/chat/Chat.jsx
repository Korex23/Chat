import Input from "./Input";
import Messages from "./Messages";
import { useContext } from "react";
import { ChatContext } from "./ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      {
        //make nothing appear if there is no chat selected
        data.user ? null : (
          <div className="chatInfo">
            <img
              src="https://www.flaticon.com/svg/vstatic/svg/3894/3894486.svg?token=exp=1629387309~hmac=1b7b4b0b4b0b0b0b0b0b0b0b0b0b0b0b"
              alt=""
              className="dp"
            />
            <span>Select a chat to start messaging</span>
          </div>
        )
      }
      <div className="chatInfo">
        <img
          src={data.user?.photoURL}
          alt={data.user?.displayName}
          className="dp"
        />
        <span>{data.user?.displayName}</span>
        {/* <div className="chatIcons">
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div> */}
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
