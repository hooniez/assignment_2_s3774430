import { Button } from "react-bootstrap";
import PostsContext from "../../contexts/PostsContext";
import { useContext } from "react";
import { deletePost } from "../../data/repository";

export default function PostDeleteButton({ post }) {
  const { posts, dispatchPosts } = useContext(PostsContext);

  const handleBlock = async () => {
    const res = await deletePost(post.id);

    const idx = posts.findIndex((el) => el.id === post.id);

    if (post.isDeletedByAdmin) {
      dispatchPosts({ type: "UNDELETE_POST", payload: idx });
    } else {
      dispatchPosts({ type: "DELETE_POST", payload: idx });
    }
  };

  return (
    <Button
      variant={post.isDeletedByAdmin ? "success" : "danger"}
      onClick={() => {
        handleBlock();
      }}
    >
      {post.isDeletedByAdmin ? "Undelete" : "Delete"}
    </Button>
  );
}
