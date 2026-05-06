import { Navigate } from "react-router-dom";
import { isAuthed, getRole } from "../utils/auth";

export default function AdminRoute({ children }) {
  if (!isAuthed()) {
    return <Navigate to="/" replace />;
  }

  if (getRole() !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}