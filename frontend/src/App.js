import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ReadingListPage from "./pages/ReadingListPage";
import SearchBookPage from "./pages/SearchBookPage";
import CreateBookPage from "./pages/CreateBookPage";

function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav style={{ marginBottom: "2rem" }}>
      <Link to="/">Home</Link>{" "}
      {user ? (
        <>
          <Link to="/reading-list">Reading List</Link>{" "}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>{" "}
          <Link to="/register">Create Account</Link>
        </>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* protected area */}
          <Route element={<PrivateRoute />}>
            <Route path="/reading-list" element={<ReadingListPage />} />
            <Route path="/search"       element={<SearchBookPage />} />
            <Route path="/create"       element={<CreateBookPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
