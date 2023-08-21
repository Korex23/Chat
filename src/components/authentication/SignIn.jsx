import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { useState } from "react";
import { ShowPassWordIcon, HidePassWordIcon } from "./SignUp";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import Logo from "../../assets/icons8-chat-96.png";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // [1
  const [passwordToggle, setpasswordToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const userRef = collection(db, "users");

  const handleEmailSignIn = async () => {
    // Clear any previous errors
    setError("");
    setIsLoading(true);

    // Check if username or password is empty

    // Query Firestore to find the user's email based on the provided username

    const usernameQuery = query(userRef, where("displayName", "==", username));
    const usernameQuerySnapshot = await getDocs(usernameQuery);

    if (!username || !password) {
      setError("Please enter a username and password.");
      setIsLoading(false);
      return;
    } else if (usernameQuerySnapshot.empty) {
      setError("Username not found.");
      setIsLoading(false);
      return;
    }

    // Get the user's email from the Firestore query result
    const userEmail = usernameQuerySnapshot.docs[0].data().email;

    try {
      await signInWithEmailAndPassword(auth, userEmail, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError(error.message); // [2]
      if (error.message === "Firebase: Error (auth/network-request-failed).") {
        setError("Network Failed, Check your internet connection");
      } else if (error.message === "Firebase: Error (auth/wrong-password).") {
        setError("Enter the correct password");
      } else if (error.message === "Firebase: Error (auth/user-not-found).") {
        setError("Email does not exist, please enter correct mail");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowHide = (e) => {
    setpasswordToggle(!passwordToggle);
    e.preventDefault();
  };

  return (
    <>
      <form className="auth-form">
        <div className="we-flex">
          <h3>Welcome to KorexChat</h3>
          <img src={Logo} alt="" width={50} height={50} />
        </div>
        <p className={error ? `error` : `no-error`}>{error}</p>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
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
        <button type="button" className="btn-style" onClick={handleEmailSignIn}>
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <p>
          Forgotten your password?
          <Link to="/resetpassword"> Forgotten Password</Link>
        </p>
      </form>
    </>
  );
};

export default SignIn;
