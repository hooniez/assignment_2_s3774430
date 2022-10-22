import { Modal, Container } from "react-bootstrap";
import PostContent from "./PostContent";

export default function ReplyModal({
  replyModalVisible,
  replyModalToggler,
  className,
  backdropClassName,
  post,
  user,
  addComment,
  numComments,
  incrementNumChildPosts,
  incrementNumChildPostsRoot,
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
            incrementNumChildPostsRoot={incrementNumChildPostsRoot}
            addComment={addComment}
          />
        </Container>
      </Modal.Body>
    </Modal>
  );
}
