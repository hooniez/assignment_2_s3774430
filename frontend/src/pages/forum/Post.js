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

import {
  deletePost,
  getNumComments,
  getHearterIds,
  getThumbDownerIds,
  removeReaction,
  thumbDown,
  heart,
} from "../../data/repository";

import PostForm from "./PostForm";
import EditModal from "./EditModal";
import PostContent from "./PostContent";
import PostsPage from "./PostsPage";
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
  onProfile,
  profileUser,
}) {
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [numComments, setNumComments] = useState(0);
  const [hearterIds, setHearterIds] = useState(new Set());
  const [thumbDownerIds, setThumbDownerIds] = useState(new Set());

  const [imgSrc, setImgSrc] = useState(post.imgSrc);

  async function loadPostData() {
    setNumComments(await getNumComments(post.id));
    setHearterIds(new Set(await getHearterIds(post.id)));
    setThumbDownerIds(new Set(await getThumbDownerIds(post.id)));
  }

  const heartHandler = async () => {
    console.log(1);
    // If the user has already given a thumbdown, remove the entry
    if (thumbDownerIds.has(user.data.id)) {
      console.log(2);
      await removeReaction(user.data.id, post.id);
      thumbDownerIds.delete(user.data.id);
      setThumbDownerIds(new Set([...thumbDownerIds]));
    }
    // If the user has yet given a heart, create an entry
    if (!hearterIds.has(user.data.id)) {
      console.log(3);
      await heart(user.data.id, post.id);
      setHearterIds(new Set([...hearterIds, user.data.id]));
    } else {
      // If the user has given a heart, remove the entry
      console.log(4);
      await removeReaction(user.data.id, post.id);
      hearterIds.delete(user.data.id);
      setHearterIds(new Set([...hearterIds]));
    }
  };

  const thumbDownHandler = async () => {
    // If the user has already given a heart, remove the entry
    if (hearterIds.has(user.data.id)) {
      await removeReaction(user.data.id, post.id);
      hearterIds.delete(user.data.id);
      setHearterIds(new Set([...hearterIds]));
    }
    // If the user has yet given a thumbdown, create an entry
    if (!thumbDownerIds.has(user.data.id)) {
      await thumbDown(user.data.id, post.id);
      setThumbDownerIds(new Set([...thumbDownerIds, user.data.id]));
    } else {
      // If the user has given a thumbdown, remove the entry
      await removeReaction(user.data.id, post.id);
      thumbDownerIds.delete(user.data.id);

      setThumbDownerIds(new Set([...thumbDownerIds]));
    }
  };

  const incrementNumChildPosts = () => {
    setNumComments(numComments + 1);
  };

  const decrementNumChildPosts = () => {
    setNumComments(numComments - 1);
  };

  useEffect(() => {
    loadPostData();
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
            onProfile={onProfile}
            profileUser={profileUser}
            hearterIds={hearterIds}
            thumbDownerIds={thumbDownerIds}
            heartHandler={heartHandler}
            thumbDownHandler={thumbDownHandler}
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
