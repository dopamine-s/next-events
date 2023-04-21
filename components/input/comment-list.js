import classes from './comment-list.module.css';
import { useMemo } from 'react';

function CommentList({ comments }) {
  const renderedComments = useMemo(() => {
    return (
      <ul className={classes.comments}>
        {comments.map((comment) => (
          <li key={comment._id}>
            <p>{comment.text}</p>
            <div>
              By <address>{comment.name}</address>
            </div>
          </li>
        ))}
      </ul>
    );
  }, [comments]);

  return renderedComments;
}

export default CommentList;
