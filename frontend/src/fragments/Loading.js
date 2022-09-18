import { Modal, Spinner } from "react-bootstrap";

export default function Loading({ children, show }) {
  return (
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>{children}</Modal.Title>
        <Modal.Body>
          <Spinner animation="border" variant="success" />
        </Modal.Body>
      </Modal.Header>
    </Modal>
  );
}
