import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
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

import EditModal from "./EditModal";
import PostContent from "./PostContent";
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
  heartHandlerRoot,
  thumbDownHandlerRoot,
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

  const heartHandler = async () => {
    heartDBHandler();
    heartStateHandler();
  };

  const thumbDownHandler = async () => {
    thumbDownDBHandler();
    thumbDownStateHandler();
  };

  const heartDBHandler = async () => {
    // If the user has already given a thumbdown, remove the entry
    if (thumbDownerIds.has(user.data.id)) {
      await removeReaction(user.data.id, post.id);
    }
    // If the user has yet given a heart, create an entry
    if (!hearterIds.has(user.data.id)) {
      await heart(user.data.id, post.id);
    } else {
      // If the user has given a heart, remove the entry
      await removeReaction(user.data.id, post.id);
    }
  };

  const heartStateHandler = () => {
    // If the user has already given a thumbdown, remove the entry
    if (thumbDownerIds.has(user.data.id)) {
      thumbDownerIds.delete(user.data.id);
      setThumbDownerIds(new Set([...thumbDownerIds]));
    }
    // If the user has not yet given a heart, create an entry
    if (!hearterIds.has(user.data.id)) {
      setHearterIds(new Set([...hearterIds, user.data.id]));
    } else {
      // If the user has given a heart, remove the entry
      hearterIds.delete(user.data.id);
      setHearterIds(new Set([...hearterIds]));
    }
  };

  const thumbDownDBHandler = async () => {
    // If the user has already given a heart, remove the entry
    if (hearterIds.has(user.data.id)) {
      await removeReaction(user.data.id, post.id);
    }
    // If the user has not yet given a thumbdown, create an entry
    if (!thumbDownerIds.has(user.data.id)) {
      await thumbDown(user.data.id, post.id);
    } else {
      // If the user has given a thumbdown, remove the entry
      await removeReaction(user.data.id, post.id);
    }
  };

  const thumbDownStateHandler = () => {
    // If the user has already given a heart, remove the entry
    if (hearterIds.has(user.data.id)) {
      hearterIds.delete(user.data.id);
      setHearterIds(new Set([...hearterIds]));
    }
    // If the user has yet given a thumbdown, create an entry
    if (!thumbDownerIds.has(user.data.id)) {
      setThumbDownerIds(new Set([...thumbDownerIds, user.data.id]));
    } else {
      // If the user has given a thumbdown, remove the entry
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
    async function loadPostData() {
      setNumComments(await getNumComments(post.id));
      setHearterIds(new Set(await getHearterIds(post.id)));
      setThumbDownerIds(new Set(await getThumbDownerIds(post.id)));
    }
    loadPostData();
  }, [post.id]);

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
            heartHandlerRoot={heartHandlerRoot}
            thumbDownHandlerRoot={thumbDownHandlerRoot}
            rootPost={rootPost}
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
          heartHandlerRoot={heartStateHandler}
          thumbDownHandlerRoot={thumbDownStateHandler}
        ></Comments>
      )}
    </>
  );
}
