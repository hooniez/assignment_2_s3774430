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
import { ChatTextFill, PencilFill, TrashFill, X } from "react-bootstrap-icons";
import Comments from "./Comments";
import styles from "./Post.module.css";
import convertTime from "../../util/convertTime";
import { deletePost, getNumChildPosts } from "../../data/repository";
import deletedUserIcon from "./delete-user.png";
import PostForm from "./PostForm";

export default function Post({
  post,
  posts,
  childId,
  user,
  dispatchUser,
  addPost,
  removePost,
  editPost,
  users,
}) {
  const [commentShow, setCommentShow] = useState(false);
  const [deleteModalHidden, setDeleteModalHidden] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [numComments, setNumComments] = useState(0);
  const [imageViewVisible, setImageViewVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState(post.imgSrc);

  // TODO: Fix this.
  useEffect(() => {
    async function dumb() {
      setNumComments(await getNumChildPosts(post.id));
    }
    dumb();
  }, []);

  const showComment = () => {
    setCommentShow(!commentShow);
  };

  const imageRemoveHandler = () => {
    setImgSrc(null);
  };

  const confirmDeleteHandler = () => setDeleteModalHidden(false);
  const closeDeleteHandler = () => setDeleteModalHidden(true);

  const deleteHandler = async () => {
    await deletePost(post.id);
    removePost(post.id);
    setDeleteModalHidden(true);
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

  // If the user who posted a post has been deleted, show deletedUserIcon.
  const avatarSrc = post.user.isDeleted ? deletedUserIcon : post.user.avatarSrc;

  // If the user who posted a post has been deleted, show Delted User.
  const posterName = post.user.isDeleted
    ? "Deleted User"
    : `${post.user.firstName} ${post.user.lastName}`;

  const imgToggleHandler = (e) => {
    setImageViewVisible(!imageViewVisible);
  };

  const editImageChangeHandler = (imgSrc) => {
    setImgSrc(imgSrc)
  }

  return (
    <>
      <Modal show={!deleteModalHidden} onHide={closeDeleteHandler}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>Confirm to delete your post.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteHandler}>
            Close
          </Button>
          <Button variant="danger" onClick={deleteHandler}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={editModalVisible} onHide={editModalToggler} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PostForm
            key={post.id}
            user={user}
            dispatchUser={dispatchUser}
            addPost={addPost}
            postId={posts.length}
            isComment={false}
            parentPostId={null}
            replyTo={null}
            replyHandler={null}
            isEditing={true}
            post={post}
            editImageChangeHandler={editImageChangeHandler}
            editPost={editPost}
            editModalToggler={editModalToggler}
            postImgSrc={imgSrc}
          ></PostForm>
        </Modal.Body>
        {imgSrc && (
          <div className="d-flex justify-content-center">
            {/* <Button
              variant="secondary"
              className="rounded-0 d-block"
              onClick={imageRemoveHandler}
            >
              Remove the image
            </Button> */}

            <div
              className={`${styles.canvasImageContainers} position-relative`}
            >
              <X
                className={styles.x}
                size={36}
                role="button"
                onClick={imageRemoveHandler}
              ></X>
              <Image
                src={imgSrc}
                className={styles.canvasImages}
                fluid={true}
              />
            </div>
          </div>
        )}
      </Modal>
      <Card className={`mt-4 ${styles.boxShadow} `}>
        {/* <Card.Header className="d-flex justify-content-between">
          {post.postBy}
          
        </Card.Header> */}
        <Card.Body>
          <Row className="gx-0">
            <Col className="text-center" xs={{ span: 2 }}>
              <img
                src={avatarSrc}
                className={`${styles.avatar} m-2`}
                alt="Avatar"
              ></img>
            </Col>
            <Col xs={{ span: 10 }} className="position-relative">
              <div className="d-flex justify-content-between pb-2">
                <div>
                  <span className={styles.name}>{posterName}</span>
                  <span>&nbsp; &#183; &nbsp;</span>
                  <span className={styles.greyedOutText}>
                    {convertTime(post.datePosted)}
                  </span>
                </div>

                {post.postedBy === user.data.email && (
                  <div>
                    <PencilFill
                      color="royalblue"
                      role="button"
                      onClick={editModalToggler}
                      className={`${styles.iconMargin} ${styles.icons}`}
                    ></PencilFill>
                    <TrashFill
                      color="royalblue"
                      role="button"
                      onClick={confirmDeleteHandler}
                      className={`${styles.iconMargin} ${styles.icons}`}
                    ></TrashFill>
                  </div>
                )}
              </div>
              <Container>
                <Row className={styles.cardBodyRow}>
                  <div dangerouslySetInnerHTML={{ __html: post.text }} />
                  <div className={styles.uploadedImageContainer}>
                    <img
                      src={post.imgSrc}
                      className={styles.uploadedImage}
                      role="button"
                      onClick={imgToggleHandler}
                    />
                  </div>

                  {/* <Col xs={{ span: 1 }} className="position-relative"> */}
                  {/* <div
                      className={styles.uploadedImageContainer}
                      
                    > */}

                  <Modal
                    show={imageViewVisible}
                    onHide={imgToggleHandler}
                    centered
                    size="lg"
                  >
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body className="text-center">
                      <img src={post.imgSrc} className={styles.uploadedImage} />
                    </Modal.Body>
                  </Modal>
                  {/* </div> */}
                  {/* </Col> */}
                </Row>
              </Container>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Container className="d-flex justify-content-around">
            <div onClick={showComment} role="button">
              <ChatTextFill
                className={`${styles.iconMargin} ${styles.icons}`}
                color="slategrey"
              />
              <span className={styles.greyedOutText}>{numComments}</span>
            </div>
          </Container>
        </Card.Footer>
      </Card>

      {/* <Comments
        user={user}
        parentPost={post}
        posts={posts}
        dispatchUser={dispatchUser}
        addPost={addPost}
        commentId={childId}
        removePost={removePost}
        editPost={editPost}
        commentShow={commentShow}
        showComment={showComment}
        users={users}
        postRemoveHandler={null}
      ></Comments> */}
    </>
  );
}

{
  /* <Form onSubmit={editSubmitHandler} className="mt-3">
<Form.Group className="mb-3" controlId="formEditText">
  <Form.Label visuallyHidden="true">First name</Form.Label>
  <Form.Control
    as="textarea"
    required
    defaultValue={post.text}
  ></Form.Control>
</Form.Group>
<div className="d-flex justify-content-end">
  <Button variant="primary" type="submit">
    Edit
  </Button>
</div>
</Form> */
}
