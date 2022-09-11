import React, { useState, useEffect } from "react";
import { Toast, Form, Button, Modal } from "react-bootstrap";
import {
  ArrowReturnRight,
  PencilFill,
  TrashFill,
  ChatTextFill,
} from "react-bootstrap-icons";
import convertTime from "../../convertTime";
import styles from "./Comment.module.css";
import getTotalNumChildPosts from "./getTotalNumChildPosts";
import deletedUserIcon from "./delete-user.png";

export default function Comment({
  parentPost,
  posts,
  commentId,
  user,
  dispatchUser,
  addPost,
  removePost,
  editPost,
  replyHandler,
  expandComment,
  users,
  childrenToShow,
  className,
}) {
  const [editHidden, setEditHidden] = useState(true);
  const [deleteModalHidden, setDeleteModalHidden] = useState(true);
  const [moreCommentsVisible, setMoreCommentsVisible] = useState(false);
  const [initiallyRendered, setInitiallyRendered] = useState(false);

  const editHandler = () => setEditHidden(false);

  const confirmDeleteHandler = () => setDeleteModalHidden(false);
  const closeDeleteHandler = () => setDeleteModalHidden(true);

  // Focus the textarea
  const replyClickHandler = () => {
    replyHandler(commentId, posts[commentId].postBy);
    document.querySelector(".modal-content textarea").focus();
  };

  const deleteHandler = () => {
    removePost(commentId);
    setDeleteModalHidden(true);
  };

  const editSubmitHandler = (e) => {
    e.preventDefault();
    editPost(commentId, e.target[0].value);
    setEditHidden(true);
  };

  const moreCommentsHandler = () => {
    setMoreCommentsVisible(!moreCommentsVisible);
  };

  // If the number of child cocmments to show changes
  useEffect(() => {
    if (!initiallyRendered) {
      setInitiallyRendered(true);
    } else {
      setMoreCommentsVisible(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childrenToShow.length]);

  // If the user who posted a comment has been deleted, show deletedUserIcon.
  const avatarSrc =
    users[posts[commentId].postBy]?.avatarsrc ?? deletedUserIcon;

  // If the user who posted a post has been deleted, show Delted User.
  const posterName =
    users[posts[commentId].postBy] == null
      ? "Deleted User"
      : `${users[posts[commentId].postBy]?.firstName} ${
          users[posts[commentId].postBy]?.lastName
        }`;

  return (
    <>
      <Modal show={!deleteModalHidden} onHide={closeDeleteHandler}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>Confirm to delete your comment.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteHandler}>
            Close
          </Button>
          <Button variant="danger" onClick={deleteHandler}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Toast.Header
        closeButton={false}
        className={`d-flex justify-content-between ${className}`}
      >
        <div className="d-flex ">
          <img
            src={avatarSrc}
            className={`rounded me-2 ${styles.avatar}`}
            alt=""
          ></img>
          <div className="d-flex align-items-center">
            <strong className="me-auto">{posterName}</strong>
            <span>&nbsp; &#183; &nbsp;</span>
            <small>{convertTime(posts[commentId].datePosted)}</small>
          </div>
        </div>

        {posts[commentId].postBy === user.data.email && (
          <div>
            <PencilFill
              role="button"
              className={`${styles.icon} ${styles.icons}`}
              onClick={editHandler}
              color="royalblue"
            ></PencilFill>
            <TrashFill
              role="button"
              color="royalblue"
              onClick={confirmDeleteHandler}
              className={`${styles.icon} ${styles.icons}`}
            ></TrashFill>
          </div>
        )}
      </Toast.Header>
      <Toast.Body className={`${className} ${styles.toastBody}`}>
        {editHidden ? (
          posts[commentId].text
        ) : (
          <Form onSubmit={editSubmitHandler}>
            <Form.Group className="mb-3" controlId="formEditText">
              <Form.Label visuallyHidden="true">Text</Form.Label>
              <Form.Control
                as="textarea"
                required
                defaultValue={posts[commentId].text}
              ></Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Edit
            </Button>
          </Form>
        )}

        <div className="mt-3">
          <span onClick={replyClickHandler} role="button">
            <ArrowReturnRight></ArrowReturnRight> Reply
          </span>
          <div
            className={`${className} d-inline mx-2`}
            onClick={moreCommentsHandler}
            role="button"
          >
            <ChatTextFill
              className={`${styles.icons} ${styles.iconMargin}`}
              color="slategrey"
            />
            <small>{getTotalNumChildPosts(posts[commentId], posts)}</small>
          </div>
        </div>
        {moreCommentsVisible ? (
          childrenToShow.map((postIdx) => (
            <React.Fragment key={postIdx}>
              <hr></hr>
              <Comment
                className={`${styles.subComment} subComment`}
                key={postIdx}
                parentPost={commentId}
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
            </React.Fragment>
          ))
        ) : (
          <></>
        )}
      </Toast.Body>
    </>
  );
}
