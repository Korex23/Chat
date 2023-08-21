import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate, Link } from "react-router-dom";

const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
      // localStorage.removeItem("user");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button type="button" className="btn-style" onClick={handleSignOut}>
        Sign Out
      </button>
    </>
  );
};

export default SignOut;
