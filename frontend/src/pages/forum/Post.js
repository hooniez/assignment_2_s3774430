import React, { useEffect, useState } from "react";
import {
  Modal,
  Container,
  Card,
  Button,
  Form,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import {
  ArrowReturnRight,
  Chat,
  ChatTextFill,
  Cpu,
  Heart,
  Megaphone,
  PencilFill,
  TrashFill,
  X,
} from "react-bootstrap-icons";
import Comments from "./Comments";
import styles from "./Post.module.css";

import { deletePost, getNumChildPosts } from "../../data/repository";

import PostForm from "./PostForm";
import EditModal from "./EditModal";
import PostContent from "./PostContent";
import Posts from "./Posts";
import ReplyModal from "./ReplyModal";
import ImageModal from "./ImageModal";
import DeleteModal from "./DeleteModal";

export default function Post({
  post,
  user,
  addComment,
  removePost,
  editPost,
  editParentPost,
  rootPost,
  incrementNumChildPostsRoot,
  decrementNumChildPostsRoot,
  numCommentsRoot,
}) {
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [numComments, setNumComments] = useState(0);

  const [imgSrc, setImgSrc] = useState(post.imgSrc);

  async function setNumChildPosts() {
    const numChildPosts = await getNumChildPosts(post.id);
    setNumComments(numChildPosts);
  }

  const incrementNumChildPosts = () => {
    setNumComments(numComments + 1);
  };

  const decrementNumChildPosts = () => {
    setNumComments(numComments - 1);
  };

  useEffect(() => {
    setNumChildPosts();
  }, []);

  const commentsModalToggler = () => {
    setCommentsModalVisible(!commentsModalVisible);
  };

  const imageRemoveHandler = () => {
    setImgSrc(null);
  };

  const deleteModalToggler = () => setDeleteModalVisible(!deleteModalVisible);

  const deletePostHandler = async () => {
    // If it is the root post being deleted
    if (rootPost) {
      commentsModalToggler();
    }
    await deletePost(post.id);
    removePost(post.id);
    if (decrementNumChildPostsRoot) {
      decrementNumChildPostsRoot();
    }

    deleteModalToggler();
  };

  const editModalToggler = () => {
    setEditModalVisible(!editModalVisible);
    setImgSrc(post.imgSrc);
  };

  const editSubmitHandler = (e) => {
    e.preventDefault();
    editPost(post.postId, e.target[0].value);
    setEditModalVisible(false);
  };

  const imgModalToggleHandler = (e) => {
    setImageModalVisible(!imageModalVisible);
  };

  const replyModalToggler = () => {
    setReplyModalVisible(!replyModalVisible);
  };

  const editImageChangeHandler = (imgSrc) => {
    setImgSrc(imgSrc);
  };

  return (
    <>
      <Card data-test-post={post.id} className={`my-4 ${styles.boxShadow} `}>
        <Card.Body>
          <PostContent
            post={post}
            user={user}
            editModalToggler={editModalToggler}
            deleteModalToggler={deleteModalToggler}
            imgToggleHandler={imgModalToggleHandler}
            commentsModalToggler={commentsModalToggler}
            replyModalToggler={replyModalToggler}
            numComments={numComments}
            isReplying={false}
            numCommentsRoot={numCommentsRoot}
          />
        </Card.Body>
      </Card>
      <DeleteModal
        deleteModalVisible={deleteModalVisible}
        deleteModalToggler={deleteModalToggler}
        className={styles.crudModal}
        backdropClassName={styles.crudModalBackdrop}
        deletePostHandler={deletePostHandler}
        decrementNumChildPostsRoot={decrementNumChildPostsRoot}
      />
      <EditModal
        editModalVisible={editModalVisible}
        editModalToggler={editModalToggler}
        postId={post.id}
        user={user}
        post={post}
        editImageChangeHandler={editImageChangeHandler}
        editPost={editPost}
        editParentPost={editParentPost}
        imgSrc={imgSrc}
        imageRemoveHandler={imageRemoveHandler}
        className={styles.crudModal}
        backdropClassName={styles.crudModalBackdrop}
      />
      <ReplyModal
        replyModalVisible={replyModalVisible}
        replyModalToggler={replyModalToggler}
        className={styles.crudModal}
        backdropClassName={styles.crudModalBackdrop}
        post={post}
        user={user}
        numComments={numComments}
        incrementNumChildPosts={incrementNumChildPosts}
        addComment={addComment}
        incrementNumChildPostsRoot={incrementNumChildPostsRoot}
      />

      <ImageModal
        imgModalToggleHandler={imgModalToggleHandler}
        imageModalVisible={imageModalVisible}
        post={post}
        className={styles.crudModal}
        backdropClassName={styles.crudModalBackdrop}
      />

      {commentsModalVisible && !rootPost && (
        <Comments
          parentPost={post}
          defaultUser={user}
          commentsModalVisible={commentsModalVisible}
          numComments={numComments}
          commentsModalToggler={commentsModalToggler}
          editPost={editPost}
          removePost={removePost}
          incrementNumChildPostsRoot={incrementNumChildPosts}
          decrementNumChildPostsRoot={decrementNumChildPosts}
        ></Comments>
      )}
    </>
  );
}
