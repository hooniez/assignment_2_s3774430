import React, { useState, useEffect } from "react";
import { Toast, Form, Button, Modal } from "react-bootstrap";
import {
  ArrowReturnRight,
  PencilFill,
  TrashFill,
  ChatTextFill,
} from "react-bootstrap-icons";
import convertTime from "../../util/convertTime";
import styles from "./Comment.module.css";
import deletedUserIcon from "./delete-user.png";
import { deletePost } from "../../data/repository";
import EditModal from "./EditModal";
import { getNumChildPosts } from "../../data/repository";

export default function Comment({
  posts,
  commentId,
  user,
  deleteComment,
  editComment,
  replyHandler,
  expandComment,
  className,
  comment,
}) {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [moreCommentsVisible, setMoreCommentsVisible] = useState(false);
  const [initiallyRendered, setInitiallyRendered] = useState(false);
  const [numComments, setNumComments] = useState(0);

  const editButtonOnClickHandler = () => setEditModalVisible(true);

  const confirmDeleteHandler = () => setDeleteModalVisible(true);
  const closeDeleteHandler = () => setDeleteModalVisible(false);

  async function setNumChildPosts() {
    setNumComments(await getNumChildPosts(comment.id));
  }

  // Focus the textarea
  const replyClickHandler = () => {
    replyHandler(comment.id, comment.postedBy);
    document.querySelector(".modal .ql-editor").focus();
  };

  const deleteHandler = async () => {
    await deletePost(comment.id);
    deleteComment(comment.id);
    setDeleteModalVisible(false);
  };

  const editModalToggler = () => {
    setEditModalVisible(!editModalVisible);
  };

  const moreCommentsHandler = () => {
    setMoreCommentsVisible(!moreCommentsVisible);
  };

  // If the number of child cocmments to show changes
  // useEffect(() => {
  //   if (!initiallyRendered) {
  //     setInitiallyRendered(true);
  //   } else {
  //     setMoreCommentsVisible(true);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [childrenToShow.length]);

  // Fetch the number of child posts (comments) to the current comment
  useEffect(() => {
    setNumChildPosts();
  }, []);

  // If the user who posted a comment has been deleted, show deletedUserIcon.
  const avatarSrc = comment.user.isDeleted
    ? deletedUserIcon
    : comment.user.avatarSrc;

  // If the user who posted a post has been deleted, show Delted User.
  const posterName = comment.user.isDeleted
    ? "Deleted User"
    : `${comment.user.firstName} ${comment.user.lastName}`;

  return (
    <>
      <EditModal
        editModalVisible={editModalVisible}
        editModalToggler={editModalToggler}
        postId={comment.id}
        user={user}
        post={comment}
        editStateCallback={editComment}
        backdropClassName={styles.modalBackdrop}
        className={styles.modalDialog}
      />
      <Modal
        backdropClassName={styles.modalBackdrop}
        className={styles.modalDialog}
        show={deleteModalVisible}
        onHide={closeDeleteHandler}
      >
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
        className={`d-flex justify-content-between `}
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
            <small className={styles.time}>
              {convertTime(comment.datePosted)}
            </small>
          </div>
        </div>

        {comment.postedBy === user.data.email && (
          <div>
            <PencilFill
              role="button"
              className={`${styles.icon} ${styles.icons}`}
              onClick={editButtonOnClickHandler}
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
        <div dangerouslySetInnerHTML={{ __html: comment.text }} />

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
            <small>{numComments}</small>
          </div>
        </div>
        {/* {moreCommentsVisible ? (
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
        )} */}
      </Toast.Body>
    </>
  );
}
