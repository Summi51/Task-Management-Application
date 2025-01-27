import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Logout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Perform logout on component mount
    logout();
    navigate("/"); // Redirect to login page
  }, [logout, navigate]);

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
}

export default Logout;
