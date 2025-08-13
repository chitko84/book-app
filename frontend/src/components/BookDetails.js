import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddReview = async (review) => {
    try {
      const response = await axios.post(`http://localhost:5000/books/${id}/reviews`, review);
      setBook(prev => ({
        ...prev,
        reviews: [...prev.reviews, response.data],
        rating: (prev.rating * prev.reviews.length + review.rating) / (prev.reviews.length + 1)
      }));
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleUpdateReview = async (reviewId, updatedReview) => {
    try {
      await axios.put(`http://localhost:5000/books/${id}/reviews/${reviewId}`, updatedReview);
      setBook(prev => {
        const updatedReviews = prev.reviews.map(review => 
          review.id === reviewId ? { ...review, ...updatedReview } : review
        );
        
        const newRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        
        return {
          ...prev,
          reviews: updatedReviews,
          rating: parseFloat(newRating.toFixed(1))
        };
      });
      setEditingReview(null);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:5000/books/${id}/reviews/${reviewId}`);
      setBook(prev => {
        const updatedReviews = prev.reviews.filter(review => review.id !== reviewId);
        const newRating = updatedReviews.length > 0 
          ? updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
          : 0;
        
        return {
          ...prev,
          reviews: updatedReviews,
          rating: parseFloat(newRating.toFixed(1))
        };
      });
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className="book-details">
      <Link to="/">← Back to all books</Link>
      <h2>{book.title}</h2>
      <p>by {book.author}</p>
      <p className="book-rating">★ {book.rating} ({book.reviews.length} reviews)</p>
      
      <ReviewForm 
        onSubmit={editingReview ? 
          (review) => handleUpdateReview(editingReview.id, review) : 
          handleAddReview}
        initialData={editingReview}
        onCancel={() => setEditingReview(null)}
      />
      
      <div className="reviews-list">
        <h3>Reviews</h3>
        {book.reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          book.reviews.map(review => (
            <ReviewItem
              key={review.id}
              review={review}
              onEdit={() => setEditingReview(review)}
              onDelete={() => handleDeleteReview(review.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default BookDetails;