import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function CreateBookPage() {
  const nav = useNavigate();
  const [f, set] = useState({ title: "", author: "" });

  async function submit(e) {
    e.preventDefault();
    await api("/api/books", { method: "POST", body: JSON.stringify(f) });
    nav("/reading-list");
  }

  return (
    <form onSubmit={submit}>
      <h2>Create Book</h2>
      <input value={f.title} onChange={e=>set({ ...f, title: e.target.value })}
             placeholder="Title" />
      <input value={f.author} onChange={e=>set({ ...f, author: e.target.value })}
             placeholder="Author" />
      <button>Add</button>
    </form>
  );
}
