import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function ReadingListPage() {
  const [books, setBooks] = useState([]);

  async function load() {
    try {
      setBooks(await api("/api/books"));
    } catch (error) {
      console.error("Failed to load books:", error);
      
    }
  }

  useEffect(() => {
    load(); 
  }, []);

  async function del(id) {
    await api(`/api/books/${id}`, { method: "DELETE" });
    setBooks(books.filter(b => b.id !== id));
  }

  return (
    <div>
      <h2>Your Reading List</h2>

      {books.length === 0 && <p>No books yet.</p>}

      <ul>
        {books.map(b => (
          <li key={b.id}>
            {b.title} &nbsp;
            <button onClick={() => del(b.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <Link to="/search"><button>Search & Add Book (API)</button></Link>
      <Link to="/create"><button>Create Book Manually</button></Link>
    </div>
  );
}
