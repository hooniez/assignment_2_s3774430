import { Button } from "react-bootstrap";
import PostsContext from "../../contexts/PostsContext";
import { useContext } from "react";
import { deletePost } from "../../data/repository";

export default function PostDeleteButton({ post, postIdx }) {
  const { dispatchPosts } = useContext(PostsContext);

  const handleBlock = async () => {
    await deletePost(post.id);

    if (post.isDeletedByAdmin) {
      dispatchPosts({ type: "UNDELETE_POST", payload: postIdx });
    } else {
      dispatchPosts({ type: "DELETE_POST", payload: postIdx });
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
