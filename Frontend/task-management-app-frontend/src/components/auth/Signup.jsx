import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // Changed 'name' to 'username'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Added role state
  const [usernameError, setUsernameError] = useState(""); // Changed 'nameError' to 'usernameError'
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState(""); // Added role error state
  const [loading, setLoading] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setUsernameError(""); // Reset username error
    setEmailError("");
    setPasswordError("");
    setRoleError(""); // Reset role error
    setApiErrorMessage("");
    let isValid = true;

    // Username validation
    if (!username) {
      setUsernameError("Username is required.");
      isValid = false;
    }

    // Email validation
    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid.");
      isValid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    }

    // Role validation
    if (!role) {
      setRoleError("Role is required.");
      isValid = false;
    }

    if (!isValid) return;

    const obj = { email, password, username, role };
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/auth/register", // Ensure correct backend URL here
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        }
      );

      const data = await response.json();
        console.log(data)
      if (response.ok) {
        message.success("Signup successful! Please log in.");
        navigate("/");
      } else {
        // Handle error responses
        if (data.message === "Email already exists.") {
          setEmailError("Email already exists. Please use a different email.");
        } else if (data.error === "Username already exists.") {
          setUsernameError("Username already exists. Please use a different username.");
        } else {
          setApiErrorMessage(data.message || "An unexpected error occurred.");
        }
      }
    } catch (err) {
      console.error(err);
      message.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="form-container">
        <div className="form-header">
          <h2>Signup Here</h2>
        </div>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {usernameError && <p className="error">{usernameError}</p>}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <p className="error">{emailError}</p>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && <p className="error">{passwordError}</p>}
          </div>

          {/* Role Selection */}
          <div className="role-selection">
            <label>
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={(e) => setRole(e.target.value)}
              />
              User
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
              />
              Admin
            </label>
            {roleError && <p className="error">{roleError}</p>}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        {apiErrorMessage && <p className="error">{apiErrorMessage}</p>}

        <p>
          Already have an account?{" "}
          <a onClick={() => navigate("/")}>Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
