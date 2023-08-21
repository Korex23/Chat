import { auth, googleProvider, db, storage } from "../../firebase/config";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Add from "../../assets/addAvatar.png";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // [1
  const [username, setUsername] = useState("");
  const [userphoto, setUserphoto] = useState("");
  const [passwordToggle, setpasswordToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleShowHide = (e) => {
    setpasswordToggle(!passwordToggle);
    e.preventDefault();
  };

  const userRef2 = collection(db, "users");
  const handleEmailSignUp = async () => {
    setError("");
    setIsLoading(true);

    const usernameQuery = query(userRef2, where("displayName", "==", username));
    const usernameQuerySnapshot = await getDocs(usernameQuery);
    if (!username || !email || !password) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    } else if (!usernameQuerySnapshot.empty) {
      setError("Username already exists. Please choose a different username.");
      setIsLoading(false);
      return; // Prevent user creation if the username exists
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      navigate("/");
      const userRef = doc(db, "users", user.uid);
      const chatRef = doc(db, "chatdetails", user.uid);

      const date = new Date().getTime();
      const storageRef = ref(storage, `${username + date}`);
      await uploadBytesResumable(storageRef, userphoto).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(user, {
              displayName: username,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(userRef, {
              uid: user.uid,
              displayName: username,
              email,
              photoURL: downloadURL,
            });
            await setDoc(chatRef, {});
            navigate("/");
          } catch (err) {
            console.log(error);
            setError(true);
            await user.delete();
            // setLoading(false);
          }
        });
      });
    } catch (error) {
      console.error(error);
      setError(error.message); // [2]
      if (error.message === "Firebase: Error (auth/network-request-failed).") {
        setError("Network Failed, Check your internet connection");
      } else if (
        error.message === "Firebase: Error (auth/email-already-in-use)."
      ) {
        setError("Email already exists");
      } else if (!username) {
        setError("Please enter a username");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <form className="auth-form">
        <p className={error ? `error` : `no-error`}>{error}</p>
        <input
          type="file"
          onChange={(e) => setUserphoto(e.target.files[0])}
          id="file"
          // style={{ display: "none" }}
        />
        {/* <label
          htmlFor="file"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={Add} alt="" />
          <span>Add an avatar</span>
        </label> */}
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex-it">
          <input
            type={passwordToggle ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="border rounded-end border-start-0 px-2 bg-transparent mb-1"
            onClick={handleShowHide}
          >
            {passwordToggle ? <HidePassWordIcon /> : <ShowPassWordIcon />}
          </button>
        </div>
        <button type="button" className="btn-style" onClick={handleEmailSignUp}>
          {isLoading ? "Signing Up..." : "Sign Up"} {/* Show loading text */}
        </button>
        <p>
          Already have an account? <Link to="/">Sign In</Link>
        </p>
      </form>
    </>
  );
};

export const ShowPassWordIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      fill="#43655A"
      className="bi bi-eye-slash-fill"
      viewBox="0 0 16 16"
    >
      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
    </svg>
  );
};
export const HidePassWordIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      fill="#43655A"
      className="bi bi-eye-fill"
      viewBox="0 0 16 16"
    >
      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
    </svg>
  );
};
export default SignUp;
