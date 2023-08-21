import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import SignOut from "../authentication/SignOut";
import Chats from "./Chats";

const Sidebar = () => {
  return (
    <>
      <div
        className="sidebar"
        style={{ position: "relative", overflowY: "scroll" }}
      >
        <div>
          <Navbar />
          <Search />
        </div>
        <Chats />
        {/* <div style={{ position: "absolute", bottom: "0", padding: "10px" }}>
          <SignOut />
        </div> */}
      </div>
    </>
  );
};

export default Sidebar;
