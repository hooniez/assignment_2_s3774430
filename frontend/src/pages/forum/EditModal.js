import { Modal, Image } from "react-bootstrap";
import PostForm from "./PostForm";
import styles from "./EditModal.module.css";
import { X } from "react-bootstrap-icons";

export default function EditModal({
  editModalVisible,
  editModalToggler,
  postId,
  user,
  editImageChangeHandler,
  editPost,
  imgSrc,
  post,
  imageRemoveHandler,
  backdropClassName,
  className,
  editParentPost,
}) {
  return (
    <Modal
      backdropClassName={backdropClassName}
      className={className}
      show={editModalVisible}
      onHide={editModalToggler}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PostForm
          key={postId}
          user={user}
          replyTo={null}
          replyHandler={null}
          isEditing={true}
          post={post}
          editImageChangeHandler={editImageChangeHandler}
          editParentPost={editParentPost}
          editPost={editPost}
          editModalToggler={editModalToggler}
          postImgSrc={imgSrc}
          parentPostId={postId}
        ></PostForm>
      </Modal.Body>
      {imgSrc && (
        <div className="d-flex justify-content-center pb-3">
          <div className={`${styles.canvasImageContainers} position-relative`}>
            <X
              className={styles.x}
              size={36}
              role="button"
              onClick={imageRemoveHandler}
            ></X>
            <Image src={imgSrc} className={styles.canvasImages} fluid={true} />
          </div>
        </div>
      )}
    </Modal>
  );
}
