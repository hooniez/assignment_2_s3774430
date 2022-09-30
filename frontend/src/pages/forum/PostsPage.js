import { useState, useEffect, useRef } from "react";

import { Container, Row, Col } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";

import styles from "./PostsPage.module.css";

import Posts from "./Posts";

export default function PostsPage({
  parentPost,
  defaultUser,
  editParentPost,
  removeParentPost,
  incrementNumChildPostsRoot,
  decrementNumChildPostsRoot,
  numComments,
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
          ></Posts>
        </Col>
      </Row>
    </Container>
  );
}

// case "ADD_POST":
//   return {
//     ...state,
//     data: {
//       ...state.data,
//       posts: [...state.data.posts, action.payload],
//     },
//   };
// case "DELETE_POST":
//   return {
//     ...state,
//     data: {
//       ...state.data,
//       // Filter out the post the use has just deleted
//       posts: state.data.posts.filter((post) => post !== action.payload),
//     },
//   };
