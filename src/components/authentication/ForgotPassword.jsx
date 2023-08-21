// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useState } from "react";
import { Link } from "react-router-dom";
// import { BackButton } from "./SignOut";

export const BackButton = () => {
  return (
    <Link to={-1}>
      <button className="btn-style" style={{ marginBottom: "10px" }}>
        Go back
      </button>
    </Link>
  );
};

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null); // [1
  //   const navigate = useNavigate();

  const triggerResetEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent");
      //   navigate("/");
    } catch (error) {
      console.error(error);
      setError(error.message); // [2]
      if (error.message === "Firebase: Error (auth/network-request-failed).") {
        setError("Network Failed, Check your internet connection");
      } else if (error.message === "Firebase: Error (auth/missing-email).") {
        setError("Please enter an email");
      } else if (error.message === "Firebase: Error (auth/invalid-email).") {
        setError("Please enter a valid email");
      } else if (error.message === "Firebase: Error (auth/user-not-found).") {
        setError("Email does not exist, please enter correct mail");
      }
    }
  };

  return (
    <div className="auth-form">
      <BackButton />
      <p className={error ? `error` : `no-error`}>{error}</p>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="button" className="btn-style" onClick={triggerResetEmail}>
        Reset password
      </button>
    </div>
  );
};

export default ResetPassword;
