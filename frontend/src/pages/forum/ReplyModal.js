import { Modal, Container } from "react-bootstrap";
import PostContent from "./PostContent";

export default function ReplyModal({
  replyModalVisible,
  replyModalToggler,
  className,
  backdropClassName,
  post,
  user,

  numComments,
  incrementNumChildPosts,
}) {
  return (
    <Modal
      show={replyModalVisible}
      onHide={replyModalToggler}
      size="lg"
      className={className}
      backdropClassName={backdropClassName}
    >
      <Modal.Header closeButton>
        <Modal.Title>Reply</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Container>
          <PostContent
            post={post}
            user={user}
            replyModalToggler={replyModalToggler}
            numComments={numComments}
            isReplying={true}
            incrementNumChildPosts={incrementNumChildPosts}
          />
        </Container>
      </Modal.Body>
    </Modal>
  );
}
