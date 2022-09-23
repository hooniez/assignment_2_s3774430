import { useState, useEffect, useRef } from "react";
import PostForm from "./PostForm";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import Post from "./Post";
import {
  getMorePosts,
  getPosts,
  getPostsWithoutExistingPosts,
} from "../../data/repository";
import { ArrowDown } from "react-bootstrap-icons";
import styles from "./Posts.module.css";
import { getComments } from "../../data/repository";
import { getMoreComments } from "../../data/repository";

export default function Posts({
  parentPost,
  defaultUser,
  scrollableComponent,
  editParentPost,
  removeParentPost,
}) {
  const [user = defaultUser, dispatchUser] = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const mostOuterElement = useRef(null);
  const postLimits = 10;

  async function loadPosts() {
    let newPosts;
    if (parentPost == null) {
      newPosts = await getPosts();
      setPosts([...newPosts]);
      if (newPosts.length < 10) {
        setHasMorePosts(false);
      }
    } else {
      newPosts = await getComments(parentPost.id);
      setPosts([...newPosts]);
      if (newPosts.length < 10) {
        setHasMorePosts(false);
      }
    }
  }

  // Load posts
  useEffect(() => {
    loadPosts();
  }, []);

  const handleScroll = async (e) => {
    let elementToListenToScroll;
    if (parentPost == null) {
      elementToListenToScroll = window;
      let documentHeight = document.body.scrollHeight;
      let currentScroll =
        elementToListenToScroll.scrollY + elementToListenToScroll.innerHeight;
      console.log(currentScroll);
      if (documentHeight === currentScroll) {
        let ids = posts.map((post) => post.id);

        let newPosts = await getMorePosts(ids.join(","));
        if (newPosts.length === 0) {
          setHasMorePosts(false);
        } else {
          setPosts([...posts, ...newPosts]);
        }
      }
    } else {
      elementToListenToScroll = document.getElementById(
        `modalBody${parentPost.id}`
      );
      if (
        elementToListenToScroll.scrollHeight -
          elementToListenToScroll.scrollTop ===
        elementToListenToScroll.clientHeight
      ) {
        let ids = posts.map((post) => post.id);

        let newPosts = await getMoreComments(parentPost.id, ids.join(","));
        if (newPosts.length === 0) {
          setHasMorePosts(false);
        } else {
          setPosts([...posts, ...newPosts]);
        }
      }
    }
  };

  useEffect(() => {
    let elementToListenToScroll;
    if (parentPost == null) {
      elementToListenToScroll = window;
    } else {
      elementToListenToScroll = document.getElementById(
        `modalBody${parentPost.id}`
      );
    }

    if (!hasMorePosts) {
      elementToListenToScroll.removeEventListener("scroll", handleScroll);
    } else {
      elementToListenToScroll.addEventListener("scroll", handleScroll);
    }

    // When the user leaves the forum, call the cleanup function
    return () => {
      elementToListenToScroll.removeEventListener("scroll", handleScroll);
    };
  }, [posts, setHasMorePosts]);

  const addPost = (post) => {
    setPosts([post, ...posts]);
  };

  const removePost = (id) => {
    // removePost does not actually remove the post from the database, but sets its isDeleted property to false so that it is not displayed anymore.
    setPosts(posts.filter((post) => post.id !== id));
    // dispatchUser({
    //   type: "DELETE_POST",
    //   payload: id,
    // });
  };

  const removeImage = (id) => {
    // setPosts(...posts, posts.filter((post) => post.id === id))
  };

  const editPost = (id, newPost) => {
    // Find the old post in posts and then replace with newPost
    let oldPost = posts.filter((post) => post.id == id)[0];
    let idx = posts.indexOf(oldPost);
    posts[idx] = newPost;
    setPosts([...posts]);
  };

  // Every time a post is added, edited, or deleted, update localStorage
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  return (
    <Container className="component py-0" ref={mostOuterElement}>
      <Row>
        <Col lg={{ span: 6, offset: 3 }}>
          <Row>
            <Col lg={{ span: 10, offset: 1 }}>
              {parentPost != null ? (
                <Post
                  post={parentPost}
                  user={user}
                  editPost={editParentPost}
                  rootPost={true}
                  removePost={removeParentPost}
                ></Post>
              ) : (
                <Card className="mt-5">
                  <Card.Body className={styles.cardBody}>
                    <PostForm
                      key={0}
                      user={user}
                      dispatchUser={dispatchUser}
                      addPost={addPost}
                      postId={posts.length}
                      forComments={false}
                      parentPostId={null}
                      replyTo={null}
                      replyHandler={null}
                      post={null}
                    ></PostForm>
                  </Card.Body>
                </Card>
              )}

              <hr></hr>
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
                ></Post>
              ))}
              <div className="text-center mt-5">
                {hasMorePosts ? (
                  <>
                    <div className="pb-2">
                      <span>Scroll down to see more posts</span>
                    </div>
                    <div>
                      <ArrowDown
                        className={styles.arrowDown}
                        size={48}
                      ></ArrowDown>
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
        </Col>
      </Row>
    </Container>
  );
}
