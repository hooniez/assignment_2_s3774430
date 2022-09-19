import { useState, useEffect } from "react";
import PostForm from "./PostForm";
import { Container, Row, Col } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import Post from "./Post";
import {
  getMorePosts,
  getPosts,
  getPostsWithoutExistingPosts,
} from "../../data/repository";
import { ArrowDown } from "react-bootstrap-icons";
import styles from "./Posts.module.css";

const numPosts = 5;

export default function Posts() {
  const [user, dispatchUser, users] = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  async function loadPosts() {
    let latestPosts = await getPosts();
    setPosts([...latestPosts]);
  }

  // Load posts
  useEffect(() => {
    loadPosts();
  }, []);

  const handleScroll = async (e) => {
    let documentHeight = document.body.scrollHeight;
    let currentScroll = window.scrollY + window.innerHeight;
    if (documentHeight === currentScroll) {
      let ids = posts.map((post) => post.id);

      let newPosts = await getMorePosts(ids.join(","));
      if (newPosts.length === 0) {
        setHasMorePosts(false);
      } else {
        setPosts([...posts, ...newPosts]);
      }
    }
  };

  useEffect(() => {
    if (!hasMorePosts) {
      window.removeEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
    }

    // When the user leaves the forum, call the cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [posts, setHasMorePosts]);

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
          <div className="text-center mt-5">
            {hasMorePosts ? (
              <>
                <div className="pb-2">
                  <span>Scroll down to see more posts</span>
                </div>
                <div>
                  <ArrowDown className={styles.arrowDown} size={48}></ArrowDown>
                </div>
              </>
            ) : (
              <div className="pb-2">
                <span>No more posts</span>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
