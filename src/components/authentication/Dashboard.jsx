import SignOut from "./SignOut";
import { auth } from "../../firebase/config";
import Sidebar from "../chat/Sidebar";
import Chat from "../chat/Chat";
import { useEffect, useRef } from "react";

const Dashboard = () => {
  return (
    <>
      <div className="home">
        <div className="home-container">
          <Sidebar />
          <Chat />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
