function ReviewItem({ review, onEdit, onDelete }) {
  return (
    <div className="review-item">
      <div className="review-user">{review.user}</div>
      <div className="review-rating">
        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
      </div>
      <div className="review-comment">{review.comment}</div>
      <div className="review-actions">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

export default ReviewItem;