import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { AuthContext } from "../context/AuthContext";
import { TextField, Button, CircularProgress, Box, Typography } from "@mui/material";

const Login = () => {
  const { login } = useContext(AuthContext);
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

    const obj = { email, password };

    setLoading(true);
    try {
      const response = await fetch("https://task-management-application-orpin.vercel.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      const data = await response.json();
      console.log(data, "data login");
      if (response.ok) {
        const { token } = data;
        login(token);
        console.log(data.role, "res role");
        message.success("Login successful!");
        if (data.role === "user") {
          navigate("/userdashboard");
        } else {
          navigate("/admindashboard");
        }
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
      }}
    >
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Login
      </Typography>

      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 400 }}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </form>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          Don’t have an account?{" "}
          <a
            href="#"
            onClick={() => navigate("/signup")}
            style={{ color: '#1976d2', textDecoration: 'underline' }}
          >
            Sign Up
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
