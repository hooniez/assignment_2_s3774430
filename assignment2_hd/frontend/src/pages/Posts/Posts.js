import { useEffect, useReducer } from "react";
import gql from "graphql-tag";
import { getPosts } from "../../data/repository";
import PostsTable from "./PostsTable";
import PostsContext from "../../contexts/PostsContext";
import PostsReducer from "../../reducers/PostsReducer";
import client from "../../apollo/client";
import { Toast } from "react-bootstrap";

export default function Posts() {
  const [posts, dispatchPosts] = useReducer(PostsReducer, []);

  useEffect(() => {
    const loadPosts = async () => {
      const currentPosts = await getPosts();

      dispatchPosts({ type: "SET_POSTS", payload: currentPosts });
    };

    loadPosts();
  }, []);

  // Setup subscription
  useEffect(() => {
    // Subscribe to the GraphQL thumbdowns subscription.
    const subscription = client
      .subscribe({
        query: gql`
          subscription {
            thumbdowns {
              postId
              reaction
              dateReacted
            }
          }
        `,
      })
      .subscribe({
        next: (res) => {
          let payload = {};
          const thumbdowns = res.data.thumbdowns;
          const idx = posts.findIndex((el) => el.id === thumbdowns[0].postId);
          payload.thumbdowns = thumbdowns;
          payload.idx = idx;

          dispatchPosts({
            type: "SET_THUMBDOWNS_FOR_POST_BY_IDX",
            payload: payload,
          });
        },
      });

    return () => {
      subscription.unsubscribe();
    };
  });

  if (posts == null) return null;

  return (
    <div>
      <div className="d-flex justify-content-between my-5">
        <h1>Posts</h1>
        {posts.find(
          (post) => post?.thumbdowns?.length >= 5 && !post.isDeletedByAdmin
        ) && (
          <Toast bg="danger">
            <Toast.Header closeButton={false}>
              <strong className="me-auto">Lynching Alert</strong>
            </Toast.Header>
            <Toast.Body className="text-white">
              Go attend to the posts:{" "}
              <strong>
                {posts.find((post) => post?.thumbdowns?.length >= 5).id}
              </strong>
            </Toast.Body>
          </Toast>
        )}
      </div>

      <PostsContext.Provider value={{ posts, dispatchPosts }}>
        <PostsTable></PostsTable>
      </PostsContext.Provider>
    </div>
  );
}
