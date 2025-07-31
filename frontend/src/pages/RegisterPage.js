
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm]   = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  // update form state for both inputs
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(form.username.trim(), form.password);
      navigate("/reading-list", { replace: true });  // go to list after success
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Account</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        name="username"
        placeholder="Username"
        autoComplete="username"
        value={form.username}
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="new-password"
        value={form.password}
        onChange={handleChange}
      />

      <button type="submit" disabled={!form.username || !form.password}>
        Register
      </button>
    </form>
  );
}
