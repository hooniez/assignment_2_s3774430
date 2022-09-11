import { useState } from "react";
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
import { ChatTextFill, PencilFill, TrashFill } from "react-bootstrap-icons";
import Comments from "./Comments";
import styles from "./Post.module.css";
import convertTime from "../../convertTime";
import getTotalNumChildPosts from "./getTotalNumChildPosts";
import deletedUserIcon from "./delete-user.png";

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
  const [editHidden, setEditHidden] = useState(true);

  const showComment = () => {
    setCommentShow(!commentShow);
  };

  const confirmDeleteHandler = () => setDeleteModalHidden(false);
  const closeDeleteHandler = () => setDeleteModalHidden(true);

  const deleteHandler = () => {
    removePost(post.postId);
    setDeleteModalHidden(true);
  };

  const editHandler = () => setEditHidden(false);

  const editSubmitHandler = (e) => {
    e.preventDefault();
    editPost(post.postId, e.target[0].value);
    setEditHidden(true);
  };

  // If the user who posted a post has been deleted, show deletedUserIcon.
  const avatarSrc = users[post.postBy]?.avatarsrc ?? deletedUserIcon;

  // If the user who posted a post has been deleted, show Delted User.
  const posterName =
    users[post.postBy] == null
      ? "Deleted User"
      : `${users[post.postBy]?.firstName} ${users[post.postBy]?.lastName}`;

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
      <Card className={`mt-4 ${styles.boxShadow} `}>
        {/* <Card.Header className="d-flex justify-content-between">
          {post.postBy}
          
        </Card.Header> */}
        <Card.Body>
          <Row className="gx-0">
            <Col xs={{ span: 2 }}>
              <img
                src={avatarSrc}
                className={`${styles.avatar} m-2`}
                alt="Avatar"
              ></img>
            </Col>
            <Col>
              <div className="d-flex justify-content-between">
                <div>
                  <span className={styles.name}>{posterName}</span>
                  <span>&nbsp; &#183; &nbsp;</span>
                  <span className={styles.greyedOutText}>
                    {convertTime(post.datePosted)}
                  </span>
                </div>

                {post.postBy === user.data.email && (
                  <div>
                    <PencilFill
                      color="royalblue"
                      role="button"
                      onClick={editHandler}
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
                {editHidden ? (
                  post.text
                ) : (
                  <Form onSubmit={editSubmitHandler} className="mt-3">
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
                  </Form>
                )}
              </Container>
              <Image src={post.img} className="img-fluid mt-3 rounded"></Image>
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
              <span className={styles.greyedOutText}>
                {getTotalNumChildPosts(post, posts)}
              </span>
            </div>
          </Container>
        </Card.Footer>
      </Card>

      <Comments
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
      ></Comments>
    </>
  );
}
