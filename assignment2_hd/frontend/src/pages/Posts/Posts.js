import { useEffect, useReducer, useState } from "react";
import { getPosts } from "../../data/repository";
import PostsTable from "./PostsTable";
import PostsContext from "../../contexts/PostsContext";
import PostsReducer from "../../reducers/PostsReducer";

export default function Posts() {
  const [posts, dispatchPosts] = useReducer(PostsReducer, []);

  useEffect(() => {
    const loadPosts = async () => {
      const currentPosts = await getPosts();

      dispatchPosts({ type: "SET_POSTS", payload: currentPosts });
    };

    loadPosts();
  }, []);

  if (posts == null) return null;

  return (
    <div>
      <h1 className="my-4">Posts</h1>
      <PostsContext.Provider value={{ posts, dispatchPosts }}>
        <PostsTable></PostsTable>
      </PostsContext.Provider>
    </div>
  );
}
