import { Route, Routes } from "react-router-dom";
import SignUp from "../auth/Signup";
import Signin from "../auth/Signin";
import PrivateRoute from "../privateRoute/PrivateRoute";
import Logout from "../auth/Logout";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";


const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/" element={<Signin />}></Route>
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/userdashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admindashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};
export default AllRoutes;