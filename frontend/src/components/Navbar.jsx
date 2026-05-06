import { Link, useNavigate } from "react-router-dom";

import {
  logout,
  getRole,
} from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();

  const role = getRole();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center bg-slate-900 px-8 py-4 shadow-lg">
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-bold text-cyan-400">
          Team Task Manager
        </h1>

        <Link
          className="hover:text-cyan-400 transition"
          to="/dashboard"
        >
          Dashboard
        </Link>

        <Link
          className="hover:text-cyan-400 transition"
          to="/projects"
        >
          Projects
        </Link>

        <Link
          className="hover:text-cyan-400 transition"
          to="/tasks"
        >
          Tasks
        </Link>

        {role === "Admin" && (
          <span className="bg-cyan-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
            Admin
          </span>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </nav>
  );
}