import { createContext, useContext, useState } from "react";
import { api } from "./api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  async function register(username, password) {
    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      throw new Error("Username and password are required");
    }
    
    await api("/api/register", {
      method: "POST",
      body: JSON.stringify({ username: trimmedUsername, password }),
    });
    await login(trimmedUsername, password);       
  }

  async function login(username, password) {
    const { access_token } = await api("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem("token", access_token);
    setUser({ username });
    localStorage.setItem("user", JSON.stringify({ username }));
  }

  function logout() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
