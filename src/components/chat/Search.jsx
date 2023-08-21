import { useState } from "react";
import { auth, db } from "../../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

const Search = () => {
  const currentUser = auth.currentUser;
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username) {
      setUser(null);
    }
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setUsername(inputValue);

    // Clear the user data and error when the input is empty
    if (inputValue === "") {
      setUser(null);
      setErr(false);
    }
  };
  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        console.log("Chat created successfully");
        //create user chats
        await updateDoc(doc(db, "chatdetails", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "chatdetails", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUsername("");
  };
  return (
    <div>
      <div className="flex-it search-form">
        <input
          type={"text"}
          placeholder="Find a user"
          value={username}
          onChange={handleInputChange}
        />
        <button
          className="border rounded-end border-start-0 px-2 bg-transparent mb-1"
          onClick={handleSearch}
        >
          <SearchIcon />
        </button>
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="usersChat usersChat2" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="usersChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const SearchIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.612 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3l-1.4 1.4ZM9.5 14q1.875 0 3.188-1.313T14 9.5q0-1.875-1.313-3.188T9.5 5Q7.625 5 6.312 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14Z"
      />
    </svg>
  );
};
export default Search;
