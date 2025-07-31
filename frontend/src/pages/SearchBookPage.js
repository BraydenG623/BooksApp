import { useState } from "react";
import { api } from "../api";

export default function SearchBookPage() {
  const [q, setQ] = useState("");
  const [results, setRes] = useState([]);

  async function search() {
    const data = await api(`/api/openlibrary/search?q=${encodeURIComponent(q)}`);
    setRes(data.docs.slice(0, 10));         
  }

  async function save(doc) {
    await api("/api/books", {
      method: "POST",
      body: JSON.stringify({
        title: doc.title,
        author: doc.author_name?.[0],
        first_publish_year: doc.first_publish_year,
        open_library_key: doc.key,
        cover_id: doc.cover_i
      })
    });
    alert("Added!");
  }

  return (
    <>
      <h2>Search Book</h2>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search term" />
      <button onClick={search}>Search</button>

      <ul>
        {results.map(d => (
          <li key={d.key}>
            {d.title} ({d.first_publish_year}) &nbsp;
            <button onClick={() => save(d)}>Add</button>
          </li>
        ))}
      </ul>
    </>
  );
}
