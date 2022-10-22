import { useRef } from "react";

import { Container, Row, Col } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";

import Posts from "./Posts";

export default function PostsPage({
  parentPost,
  defaultUser,
  editParentPost,
  removeParentPost,
  incrementNumChildPostsRoot,
  decrementNumChildPostsRoot,
  numComments,
  heartHandlerRoot,
  thumbDownHandlerRoot,
}) {
  const [user = defaultUser, dispatchUser] = useOutletContext();
  const mostOuterElement = useRef(null);

  return (
    <Container className="component py-0" ref={mostOuterElement}>
      <Row>
        <Col lg={{ span: 6, offset: 3 }}>
          <Posts
            parentPost={parentPost}
            user={user}
            editParentPost={editParentPost}
            removeParentPost={removeParentPost}
            incrementNumChildPostsRoot={incrementNumChildPostsRoot}
            decrementNumChildPostsRoot={decrementNumChildPostsRoot}
            numComments={numComments}
            dispatchUser={dispatchUser}
            heartHandlerRoot={heartHandlerRoot}
            thumbDownHandlerRoot={thumbDownHandlerRoot}
          ></Posts>
        </Col>
      </Row>
    </Container>
  );
}
