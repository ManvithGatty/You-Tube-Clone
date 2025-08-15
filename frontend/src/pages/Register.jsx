import { useState } from "react";
import API from "../api/axios.js";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Register the user
      await API.post("/auth/register", formData);

      // Auto login after register
      const res = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = res.data;

      // Save to Redux & localStorage
      dispatch(setCredentials({ user, token }));

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full p-2 border rounded"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="avatar"
          placeholder="Avatar URL (optional)"
          className="w-full p-2 border rounded"
          value={formData.avatar}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}
