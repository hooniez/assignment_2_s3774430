import { Modal } from "react-bootstrap";
import styles from "./ImageModal.module.css";

export default function ImageModal({
  imgModalToggleHandler,
  imageModalVisible,
  post,
  className,
  backdropClassName,
}) {
  return (
    <Modal
      show={imageModalVisible}
      onHide={imgModalToggleHandler}
      centered
      size="lg"
      className={className}
      backdropClassName={backdropClassName}
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="text-center">
        <img src={post.imgSrc} className={styles.uploadedImage} />
      </Modal.Body>
    </Modal>
  );
}
