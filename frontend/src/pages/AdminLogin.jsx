import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await loginRequest({
        email,
        password
      });
      login(response.data.user, response.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }
  return <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full">
        <Link to="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-4 font-medium">
          ← Back to homepage
        </Link>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-xl font-bold text-gray-800 mb-1 text-center">Admin Login</h1>
        <p className="text-sm text-gray-400 mb-6 text-center">DigitalSoft Lead Management</p>

        {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2 mb-4 border border-red-100">
            {error}
          </div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-semibold transition">
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
        </div>
      </div>
    </div>;
}
