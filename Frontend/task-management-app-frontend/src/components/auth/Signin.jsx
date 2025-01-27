import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext); // Get the login function from context
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    let isValid = true;

    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    }

    if (!isValid) return;

    const obj = { email, password};

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      const data = await response.json(obj);
      console.log(data)
      if (response.ok) {
        const { token } = data;
        // Use the login function from the context to store token and user data
        login(token);
        message.success("Login successful!");
        navigate("/userdashboard"); // Redirect to a protected route, e.g., Dashboard
      } else {
        setEmailError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p>{emailError}</p>}
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <p>{passwordError}</p>}
        
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
      <p>
        Don’t have an account?{" "}
            <a
              class="text-blue-500 hover:underline cursor-pointer"
                onClick={() => navigate("/signup")}>
                      Sign Up
            </a>
          </p>
   {/* <button onClick={dashboardClick}> User Dashboard</button> */}
    </div>
  );
};

export default Login;
