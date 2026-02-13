import { Navigate } from "react-router-dom";
import { getRole } from "./auth";

const RequireAdmin = ({ children }) => {
  return getRole() === "admin" ? children : <Navigate to="/" />;
};

export default RequireAdmin;