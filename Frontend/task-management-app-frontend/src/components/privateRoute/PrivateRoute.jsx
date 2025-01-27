import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    alert("Please Login First!");
    return <Navigate to="/" />; 
  }

  return children;
};

export default PrivateRoute;
