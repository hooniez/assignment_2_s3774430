import { Modal, Button } from "react-bootstrap";

export default function DeleteModal({
  deleteModalVisible,
  deleteModalToggler,
  className,
  backdropClassName,
  deletePostHandler,
}) {
  return (
    <Modal
      show={deleteModalVisible}
      onHide={deleteModalToggler}
      className={className}
      backdropClassName={backdropClassName}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>Confirm to delete your post.</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={deleteModalToggler}>
          Close
        </Button>
        <Button variant="danger" onClick={deletePostHandler}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
