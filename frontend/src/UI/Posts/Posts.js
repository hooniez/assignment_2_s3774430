import { useState, useEffect } from "react";
import PostForm from "./PostForm";
import { Container, Row, Col } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import Post from "./Post";

const numPosts = 5;

export default function Posts() {
  const [user, dispatchUser, users] = useOutletContext();
  // First read posts from localStorage if any. Otherwise, initiate posts with an empty array
  const [posts, setPosts] = useState(
    JSON.parse(localStorage.getItem("posts")) ?? []
  );

  const addPost = (post, isComment, parentPostId) => {
    setPosts([...posts, post]);
    dispatchUser({
      type: "ADD_POST",
      payload: posts.length,
    });
    // If the post being added is a comment
    if (isComment) {
      posts[parentPostId].children.push(post.postId);
    }
  };

  const removePost = (id) => {
    // removePost does not actually remove the post from the database, but sets its isDeleted property to false so that it is not displayed anymore.
    posts[id].isDeleted = true;
    // setPosts to fire its associated useEffect
    setPosts([...posts]);
    dispatchUser({
      type: "DELETE_POST",
      payload: id,
    });
  };

  const editPost = (id, text) => {
    posts[id].text = text;
    setPosts([...posts]);
  };

  // Every time a post is added, edited, or deleted, update localStorage
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  return (
    <Container className="my-5">
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <PostForm
            user={user}
            dispatchUser={dispatchUser}
            addPost={addPost}
            postId={posts.length}
            isComment={false}
            parentPostId={null}
            replyTo={null}
            replyHandler={null}
          ></PostForm>
          {posts
            .filter((post) => !post.isDeleted && post.parentId === null)
            .slice(-numPosts)
            .reverse()
            .map((post) => (
              <Post
                key={post.postId}
                user={user}
                dispatchUser={dispatchUser}
                post={post}
                posts={posts}
                childId={posts.length}
                addPost={addPost}
                removePost={removePost}
                editPost={editPost}
                users={users}
              ></Post>
            ))}
        </Col>
      </Row>
    </Container>
  );
}
