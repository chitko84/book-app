const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory data storage
let books = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    rating: 4.2,
    reviews: [
      { id: 1, user: 'Alice', rating: 5, comment: 'A classic!' },
      { id: 2, user: 'Bob', rating: 4, comment: 'Great read' }
    ]
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    rating: 4.5,
    reviews: [
      { id: 1, user: 'Charlie', rating: 5, comment: 'Powerful story' }
    ]
  }
];

// GET all books
app.get('/books', (req, res) => {
  res.json(books.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    rating: book.rating
  })));
});

// GET book details by id
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');
  res.json(book);
});

// POST add review to a book
app.post('/books/:id/reviews', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');

  const { user, rating, comment } = req.body;
  if (!user || !rating || !comment) {
    return res.status(400).send('Missing required fields');
  }

  const newReview = {
    id: book.reviews.length + 1,
    user,
    rating: parseInt(rating),
    comment
  };

  book.reviews.push(newReview);
  
  // Update book rating (average of all reviews)
  const totalRating = book.reviews.reduce((sum, review) => sum + review.rating, 0);
  book.rating = (totalRating / book.reviews.length).toFixed(1);
  
  res.status(201).json(newReview);
});

// PUT update a review
app.put('/books/:id/reviews/:reviewId', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');

  const review = book.reviews.find(r => r.id === parseInt(req.params.reviewId));
  if (!review) return res.status(404).send('Review not found');

  const { rating, comment } = req.body;
  if (rating) review.rating = parseInt(rating);
  if (comment) review.comment = comment;
  
  // Update book rating
  const totalRating = book.reviews.reduce((sum, r) => sum + r.rating, 0);
  book.rating = (totalRating / book.reviews.length).toFixed(1);
  
  res.json(review);
});

// DELETE a review
app.delete('/books/:id/reviews/:reviewId', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');

  const reviewIndex = book.reviews.findIndex(r => r.id === parseInt(req.params.reviewId));
  if (reviewIndex === -1) return res.status(404).send('Review not found');

  book.reviews.splice(reviewIndex, 1);
  
  // Update book rating
  if (book.reviews.length > 0) {
    const totalRating = book.reviews.reduce((sum, r) => sum + r.rating, 0);
    book.rating = (totalRating / book.reviews.length).toFixed(1);
  } else {
    book.rating = 0;
  }
  
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
