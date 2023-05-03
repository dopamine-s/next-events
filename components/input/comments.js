import { useState, useEffect, useContext, useCallback } from 'react';

import CommentList from './comment-list';
import NewComment from './new-comment';
import classes from './comments.module.css';
import NotificationContext from '../../store/notification-context';

function Comments({ eventId }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);

  const notificationCtx = useContext(NotificationContext);

  const fetchComments = useCallback(() => {
    if (showComments) {
      setError(null);
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
  }, [eventId, showComments]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    if (notificationCtx.successfullyAdded) {
      setError(null);
      fetchComments();
    }
  }, [fetchComments, notificationCtx.successfullyAdded]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {
    setFormIsSubmitting(true);
    notificationCtx.showNotification({
      title: 'Sending comment...',
      message: 'Adding comment to database...',
      status: 'pending',
    });
    fetch('/api/comments/' + eventId, {
      method: 'POST',
      body: JSON.stringify(commentData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        {
          if (!response.ok) {
            console.log(response);
            throw new Error(`
            ${response.statusText ?? 'HTTP error'}, status = ${
              response.status
            }`);
          }
          return response.json();
        }
      })
      .then((data) => {
        const newComment = { ...commentData, _id: data.comment._id };
        setComments((prevComments) => [newComment, ...prevComments]);
        notificationCtx.showNotification({
          title: 'Success!',
          message: 'Successfully added your comment!',
          status: 'success',
        });
      })
      .catch((error) => {
        console.error(error);
        notificationCtx.showNotification({
          title: 'Error!',
          message: 'Failed adding the comment. ' + error.message ?? '',
          status: 'error',
        });
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
      {loading && <p className={classes.loader}>Loading...</p>}
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
