import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [f, set] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      await login(f.username, f.password);
      nav("/reading-list");
    } catch (e) { setErr(e.message); }
  }

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      {err && <p style={{ color: "red" }}>{err}</p>}
      <input value={f.username} onChange={e=>set({ ...f, username: e.target.value })}
             placeholder="Username" />
      <input type="password" value={f.password} onChange={e=>set({ ...f, password: e.target.value })}
             placeholder="Password" />
      <button>Login</button>
    </form>
  );
}
