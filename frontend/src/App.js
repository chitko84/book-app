import { Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import BookDetails from './components/BookDetails';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>BookNook</h1>
          <p>Discover and review your favorite books</p>
        </div>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;