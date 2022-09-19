import { useState, useEffect } from "react";
import PostForm from "./PostForm";
import { Container, Row, Col } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import Post from "./Post";
import { getPosts } from "../../data/repository";

const numPosts = 5;

export default function Posts() {
  const [user, dispatchUser, users] = useOutletContext();
  const [posts, setPosts] = useState([]);

  async function loadPosts() {
    const currentPosts = await getPosts();
    setPosts(currentPosts);
  }

  // Load posts
  useEffect(() => {
    loadPosts();
  }, []);

  const addPost = (post, isComment, parentPostId) => {
    setPosts([post, ...posts]);
    // dispatchUser({
    //   type: "ADD_POST",
    //   payload: posts.length,
    // });
    // If the post being added is a comment
    // if (isComment) {
    //   posts[parentPostId].children.push(post.postId);
    // }
  };

  const removePost = (id) => {
    // removePost does not actually remove the post from the database, but sets its isDeleted property to false so that it is not displayed anymore.
    loadPosts();
    // dispatchUser({
    //   type: "DELETE_POST",
    //   payload: id,
    // });
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
    <Container className="component py-5">
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
          {posts.map((post) => (
            <Post
              key={post.id}
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
