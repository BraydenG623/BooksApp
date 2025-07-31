import React from 'react';
import '../App.css';

const HomePage = () => {
  return (
    <div>
      <header>
              <h1 style={{ textAlign: 'center'}}  >BookLogger</h1>
      </header>
      <main>
        <p className="boldtext">Welcome to booklogger, where you can search books you like and add them to your reading list</p>

      </main>
    </div>
  );
}

export default HomePage;