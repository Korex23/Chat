import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/config";
import Logo from "../../assets/icons8-chat-96.png";

const Navbar = () => {
  const user = auth.currentUser;
  const [username, setUsername] = useState();
  const [userphoto, setUserphoto] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setUsername(user.displayName);
    setUserphoto(user.photoURL);
  }, [user]);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="nav">
      <span className="nav-logo">KorexChat</span>
      <div className="nav-user">
        <span>{username}</span>
        <img
          src={userphoto}
          alt={`${username}`}
          className="dp"
          onClick={openModal}
          style={{ cursor: "pointer" }}
        />
      </div>
      {isModalOpen && (
        <div className="modal">
          <button
            onClick={closeModal}
            style={{ marginBottom: "10px" }}
            className="btn-style"
          >
            Close
          </button>
          <div className="modal-content">
            {/* Content of the modal */}
            <img
              src={userphoto}
              alt={`${username}`}
              className="modal-user-photo"
            />
            {/* <p>{username}</p> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
