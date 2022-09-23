import { useEffect, useState, useParams, useRef } from "react";
import { Modal, Toast, ToastContainer } from "react-bootstrap";
import Comment from "./Comment";
import PostForm from "./PostForm";
import styles from "./Comments.module.css";
import { getComments } from "../../data/repository";
import { XLg } from "react-bootstrap-icons";
import Posts from "./Posts";

export default function Comments({
  user,
  dispatchUser,
  incrementNumChildPosts,
  decrementNumChildPosts,
  editPost,
  removePost,
  commentId,
  commentsModalVisible,
  commentsModalToggler,
  parentPost,
  defaultUser,
  numComments,
}) {
  // const navigate = useNavigate();
  // const id = useParams().id;
  const [comments, setComments] = useState([]);
  const [parentId, setParentId] = useState(parentPost.id);
  const [replyTo, setReplyTo] = useState(null);

  const addComment = (comment) => {
    setComments([...comments, comment]);
    incrementNumChildPosts();
  };

  const deleteComment = (id) => {
    setComments(comments.filter((comment) => comment.id !== id));
    decrementNumChildPosts();
  };

  const editComment = (id, newComment) => {
    // Find the old post in posts and then replace with newPost
    let oldComment = comments.filter((comment) => comment.id == id)[0];
    let idx = comments.indexOf(oldComment);
    comments[idx] = newComment;
    setComments([...comments]);
  };

  const modalCloseHandler = () => {
    commentsModalToggler();
    replyHandler(null, null);
  };

  const replyHandler = (postId, replyTo) => {
    // If postId is null, setParentId to parentPost.postId
    setParentId(postId ?? parentPost.id);
    setReplyTo(replyTo);
  };

  return (
    <Modal
      show={commentsModalVisible}
      onHide={modalCloseHandler}
      centered
      fullscreen
    >
      <Modal.Header className="d-flex justify-content-center">
        <div className={styles.modalHeaderContainer}>
          <Modal.Title>Comments</Modal.Title>
          <XLg size={20} role="button" onClick={commentsModalToggler}></XLg>
        </div>
      </Modal.Header>
      <Modal.Body id={`modalBody${parentPost.id}`}>
        {numComments === 0 ? (
          <div className="d-flex justify-content-center">
            <p className="tex">No comments yet</p>
          </div>
        ) : (
          <Posts
            key={parentPost.id}
            parentPost={parentPost}
            defaultUser={user}
            editParentPost={editPost}
            removeParentPost={removePost}
          ></Posts>
        )}
      </Modal.Body>
    </Modal>
  );
}
