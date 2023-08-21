import { doc, onSnapshot } from "firebase/firestore";
import { useState, useEffect, useContext } from "react";
import { ChatContext } from "./ChatContext";
import { db, auth } from "../../firebase/config";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const currentUser = auth.currentUser;

  const { dispatch } = useContext(ChatContext);
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "chatdetails", currentUser.uid),
        (doc) => {
          setChats(doc.data());
        }
      );

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  //   const isTextEmpty = !lastMessageessage.text || message.text.trim().length === 0;
  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            className="usersChat"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            <img src={chat[1].userInfo?.photoURL} alt="" />
            <div className="usersChatInfo">
              <span>{chat[1].userInfo?.displayName}</span>
              <p>
                {chat[1].lastMessage?.text
                  ? chat[1].lastMessage.text.substring(0, 20) + "..."
                  : ""}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
