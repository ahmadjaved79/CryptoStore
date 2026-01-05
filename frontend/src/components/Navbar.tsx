import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-900 border-b border-gray-800">
      <h1 className="text-lg font-bold text-cyan-400">
        🔐 Secure File System
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">
          {user?.email} ({user?.role})
        </span>

        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="text-sm text-cyan-400 hover:underline"
          >
            Admin
          </button>
        )}

        <button
          onClick={handleLogout}
          className="text-sm text-red-400 hover:underline"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
