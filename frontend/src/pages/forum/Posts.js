import { useState, useEffect } from "react";

import {
  getMorePosts,
  getPosts,
  getMorePostsByUser,
  getPostsByUser,
} from "../../data/repository";

import { getComments } from "../../data/repository";
import { getMoreComments } from "../../data/repository";
import Post from "./Post";
import { Card } from "react-bootstrap";
import styles from "./Posts.module.css";
import { ArrowDown } from "react-bootstrap-icons";
import PostForm from "./PostForm";

export default function Posts({
  parentPost,
  user,
  editParentPost,
  removeParentPost,
  incrementNumChildPostsRoot,
  decrementNumChildPostsRoot,
  numComments,
  dispatchUser,
  onProfile,
  profileUser,
  heartHandlerRoot,
  thumbDownHandlerRoot,
}) {
  const [posts, setPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  // Load posts
  useEffect(() => {
    async function loadPosts() {
      let newPosts;
      // If the Posts component is used for root posts
      if (parentPost == null) {
        if (onProfile) {
          // If the Posts component is used in the Profile component
          newPosts = await getPostsByUser(profileUser.id);
        } else {
          newPosts = await getPosts();
        }

        setPosts([...newPosts]);
        if (newPosts.length < 10) {
          setHasMorePosts(false);
        }
      } else {
        // If the Posts component is used for comments
        newPosts = await getComments(parentPost.id);
        setPosts([...newPosts]);
        if (newPosts.length < 10) {
          setHasMorePosts(false);
        }
      }
    }
    loadPosts();
  }, [onProfile, parentPost, profileUser?.id]);

  //
  useEffect(() => {
    const handleScroll = async (e) => {
      let elementToListenToScroll;
      // For root posts
      if (parentPost == null) {
        // Add an event listener to window
        elementToListenToScroll = window;
        let documentHeight = document.body.scrollHeight;
        let currentScroll =
          elementToListenToScroll.scrollY + elementToListenToScroll.innerHeight;
        if (documentHeight === currentScroll) {
          let newPosts;
          if (onProfile) {
            newPosts = await getMorePostsByUser(profileUser.id, posts.length);
          } else {
            newPosts = await getMorePosts(posts.length);
          }

          if (newPosts.length === 0) {
            setHasMorePosts(false);
          } else {
            setPosts([...posts, ...newPosts]);
          }
        }
      } else {
        // For comments, add an event listener to modalBody
        elementToListenToScroll = document.getElementById(
          `modalBody${parentPost.id}`
        );
        if (
          elementToListenToScroll.scrollHeight -
            elementToListenToScroll.scrollTop ===
          elementToListenToScroll.clientHeight
        ) {
          // If the user has scrolled to the bottom
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
  }, [
    posts,
    setHasMorePosts,
    hasMorePosts,
    onProfile,
    parentPost,
    profileUser?.id,
  ]);

  const addPost = (post) => {
    setPosts([post, ...posts]);
  };

  const removePost = (id) => {
    // removePost does not actually remove the post from the database, but sets its isDeleted property to false so that it is not displayed anymore.
    setPosts(posts.filter((post) => post.id !== id));
  };

  const editPost = (id, newPost) => {
    // Find the old post in posts and then replace with newPost
    let oldPost = posts.filter((post) => post.id === id)[0];
    let idx = posts.indexOf(oldPost);
    posts[idx] = newPost;
    setPosts([...posts]);
  };

  const addComment = (post) => {
    setPosts([...posts, post]);
  };

  return (
    <>
      {!onProfile && (
        <>
          {parentPost != null ? (
            <Post
              post={parentPost}
              user={user}
              addComment={addComment}
              editPost={editParentPost}
              rootPost={true}
              removePost={removeParentPost}
              incrementNumChildPostsRoot={incrementNumChildPostsRoot}
              numCommentsRoot={numComments}
              heartHandlerRoot={heartHandlerRoot}
              thumbDownHandlerRoot={thumbDownHandlerRoot}
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
        </>
      )}

      <hr className="my-5"></hr>
      {posts.map((post) => (
        <Post
          key={post.id}
          user={onProfile ? { data: user } : user}
          dispatchUser={dispatchUser}
          post={post}
          posts={posts}
          addPost={addPost}
          removePost={removePost}
          editPost={editPost}
          decrementNumChildPostsRoot={decrementNumChildPostsRoot}
          onProfile={onProfile}
          profileUser={profileUser}
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
    </>
  );
}
