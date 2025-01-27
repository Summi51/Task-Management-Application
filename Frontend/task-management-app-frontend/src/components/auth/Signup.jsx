import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import '../styles/Signup.css'
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  CircularProgress,
} from "@mui/material";

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setRoleError("");
    setApiErrorMessage("");
    
    let isValid = true;
    if (!username) {
      setUsernameError("Username is required.");
      isValid = false;
    }
    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid.");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    }
    if (!role) {
      setRoleError("Role is required.");
      isValid = false;
    }
    if (!isValid) return;

    const obj = { email, password, username, role };
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        message.success("Signup successful! Please log in.");
        navigate("/");
      } else {
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
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!usernameError}
            helperText={usernameError}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />
          <FormControl component="fieldset" margin="normal" fullWidth error={!!roleError}>
            <FormLabel component="legend">Role</FormLabel>
            <RadioGroup
              row
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <FormControlLabel value="user" control={<Radio />} label="User" />
              <FormControlLabel value="admin" control={<Radio />} label="Admin" />
            </RadioGroup>
            {roleError && <p className="error">{roleError}</p>}
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
        </form>
        {apiErrorMessage && <p className="error">{apiErrorMessage}</p>}
        <p>
          Already have an account? <a onClick={() => navigate("/")}>Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
