import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/books');
        setBooks(response.data);
        setTimeout(() => setLoading(false), 1000); // Simulate loading
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return (
    <div className="loading-container">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="book-card loading">
          <div className="book-cover shimmer"></div>
          <div className="book-info">
            <div className="shimmer title"></div>
            <div className="shimmer author"></div>
            <div className="shimmer rating"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="book-list-container">
      <h2>All Books</h2>
      <div className="book-list">
        {books.map(book => (
          <Link to={`/books/${book.id}`} key={book.id} className="book-link">
            <div className="book-card">
              <div className="book-cover">
                {book.title.split(' ').map(word => word[0]).join('')}
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <div className="book-rating">
                  {'★'.repeat(Math.floor(book.rating))}
                  {'☆'.repeat(5 - Math.floor(book.rating))}
                  <span>({book.rating})</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BookList;