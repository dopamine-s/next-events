import { useState, useEffect } from 'react';

import CommentList from './comment-list';
import NewComment from './new-comment';
import classes from './comments.module.css';

function Comments({ eventId }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);

  useEffect(() => {
    if (showComments) {
      setLoading(true);
      fetch('/api/comments/' + eventId)
        .then((response) => response.json())
        .then((data) => {
          setComments(data.comments);
          if (data.message === 'Error fetching comments!') {
            setError(data.message);
          }
        })
        .catch((error) => {
          console.log(error);
          setError('Error fetching comments!');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [showComments, eventId]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {
    setFormIsSubmitting(true);
    fetch('/api/comments/' + eventId, {
      method: 'POST',
      body: JSON.stringify(commentData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const newComment = { ...commentData, _id: data.comment._id };
        setComments((prevComments) => [newComment, ...prevComments]);
      })
      .catch((error) => {
        console.log(error);
        setError('Error adding comment!');
      })
      .finally(() => {
        setFormIsSubmitting(false);
      });
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? 'Hide' : 'Show'} Comments
      </button>
      {showComments && (
        <NewComment
          onAddComment={addCommentHandler}
          isSubmitting={formIsSubmitting}
        />
      )}
      {loading && <p>Loading...</p>}
      {!loading && !error && showComments && comments.length > 0 && (
        <CommentList comments={comments} />
      )}
      {!loading &&
        !error &&
        showComments &&
        (!comments || comments.length === 0) && <p>Still no comments</p>}
      {!loading && error && showComments && (
        <p className={classes.error}>{error}</p>
      )}
    </section>
  );
}

export default Comments;
