import { useState } from "react";
import { signupApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔐 Password strength logic
  const getPasswordStrength = () => {
    if (password.length < 6) return "Weak";
    if (
      password.match(/[A-Z]/) &&
      password.match(/[0-9]/) &&
      password.match(/[^A-Za-z0-9]/)
    ) {
      return "Strong";
    }
    return "Medium";
  };

  const strength = getPasswordStrength();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (strength === "Weak") {
      setError("Password is too weak");
      return;
    }

    try {
      setLoading(true);
      await signupApi(email, password);
      navigate("/login");
    } catch {
      setError("Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-gray-900/80 backdrop-blur-lg p-6 rounded-2xl border border-green-500/30 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-green-400">
          CryptoStore
        </h2>
        <p className="text-center text-sm text-gray-400 mb-5">
          Initial Admin Setup
        </p>

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        {/* Email */}
        <input
          className="w-full p-2 mb-3 bg-black border border-gray-700 rounded focus:border-green-500 outline-none"
          placeholder="Email address"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 bg-black border border-gray-700 rounded focus:border-green-500 outline-none"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-xs text-green-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Password strength */}
        <p
          className={`text-xs mb-3 ${
            strength === "Strong"
              ? "text-green-400"
              : strength === "Medium"
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          Password strength: {strength}
        </p>

        {/* Confirm Password */}
        <input
          type={showPassword ? "text" : "password"}
          className="w-full p-2 mb-4 bg-black border border-gray-700 rounded focus:border-green-500 outline-none"
          placeholder="Confirm password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 transition py-2 rounded font-bold text-black disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          🔐 End‑to‑end encrypted setup
        </p>
      </form>
    </div>
  );
}
