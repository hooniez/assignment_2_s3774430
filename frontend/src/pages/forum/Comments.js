import { useState } from "react";
import { Modal, Toast, ToastContainer } from "react-bootstrap";
import Comment from "./Comment";
import PostForm from "./PostForm";
import styles from "./Comments.module.css";

export default function Comments({
  parentPost,
  posts,
  user,
  dispatchUser,
  addPost,
  editPost,
  removePost,
  commentId,
  commentShow,
  showComment,
  users,
}) {
  const [parentId, setParentId] = useState(parentPost.postId);
  const [replyTo, setReplyTo] = useState(null);

  const isComment = true;

  const modalCloseHandler = () => {
    showComment();
    replyHandler(null, null);
  };

  const replyHandler = (postId, replyTo) => {
    // If postId is null, setParentId to parentPost.postId
    setParentId(postId ?? parentPost.postId);
    setReplyTo(replyTo);
  };

  return (
    <Modal show={commentShow} onHide={modalCloseHandler} centered fullscreen>
      <Modal.Header closeButton className="text-center">
        Comments
      </Modal.Header>
      <Modal.Body className="position-relative">
        {parentPost.children.length === 0 ? (
          <div className="d-flex justify-content-center">
            <p className="tex">No comments yet</p>
          </div>
        ) : (
          <ToastContainer position="top-center">
            {parentPost.children
              .filter((postIdx) => !posts[postIdx].isDeleted)
              .map((postIdx) => (
                <Toast key={postIdx} className={styles.toast}>
                  <Comment
                    key={postIdx}
                    className='rootComment'
                    parentPost={parentPost}
                    posts={posts}
                    commentId={postIdx}
                    user={user}
                    dispatchUser={dispatchUser}
                    addPost={addPost}
                    removePost={removePost}
                    editPost={editPost}
                    replyHandler={replyHandler}
                    users={users}
                    childrenToShow={posts[postIdx].children.filter(
                      (postId) => !posts[postId].isDeleted
                    )}
                  ></Comment>
                </Toast>
              ))}
          </ToastContainer>
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <PostForm
          user={user}
          className={styles.commentForm}
          dispatchUser={dispatchUser}
          addPost={addPost}
          postId={commentId}
          isComment={isComment}
          parentPostId={parentId}
          replyTo={replyTo}
          replyHandler={replyHandler}
        />
      </Modal.Footer>
    </Modal>
  );
}
