import { useState } from "react";
import { loginApi } from "../api/authApi";
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user, token } = await loginApi(email, password);
      setAuth(user, token);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">

      {/* LEFT SIDE – LOGIN FORM */}
      <div className="p-8 flex items-center justify-center">
        <form
          onSubmit={submit}
          className="w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-2 text-center text-green-400">
            CryptoStore
          </h2>
          <p className="text-sm text-gray-400 text-center mb-6">
            End‑to‑End Encrypted Access
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}

          <input
            className="w-full p-2 mb-3 bg-black border border-gray-700 rounded focus:border-green-500 outline-none"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full p-2 mb-4 bg-black border border-gray-700 rounded focus:border-green-500 outline-none"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 transition py-2 rounded font-bold text-black disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login Securely"}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            🔐 Protected by AES‑256 encryption
          </p>
        </form>
      </div>

      {/* RIGHT SIDE – CYBER SECURITY IMAGE */}
      <div className="hidden md:block relative">
        <img
          src="https://res.cloudinary.com/dcmt06mac/image/upload/v1767636368/WhatsApp_Image_2026-01-05_at_11.34.05_PM_ri06qg.jpg"
          alt="Cyber security illustration"
          className="w-full h-full object-cover"
        />

        {/* Dark overlay for cyber feel */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

    </div>
  </div>
);

}
