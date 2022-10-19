import { Table, Button } from "react-bootstrap";
import PostsContext from "../../contexts/PostsContext";
import { useContext, useEffect, useState } from "react";
import PostDeleteButton from "./PostDeleteButton";
import { PieChart } from "react-bootstrap-icons";
import AnalyticsModal from "../../fragments/AnalyticsModal";

export default function PostsTable() {
  const { posts, dispatchPosts } = useContext(PostsContext);
  const [isGraphicModalVisible, setIsGraphicModalVisible] = useState([]);

  const toggleGraphicModalVisible = (idx) => {
    setIsGraphicModalVisible(
      Object.values({
        ...isGraphicModalVisible,
        [idx]: !isGraphicModalVisible[idx],
      })
    );
  };

  useEffect(() => {
    // Set isGraphicModalVisible for each post to false
    let arr = [];
    for (let i = 0; i < posts.length; i++) {
      arr.push(false);
    }

    setIsGraphicModalVisible([...arr]);
  }, [posts.length]);

  return (
    <Table striped>
      <thead>
        <tr>
          <th>Id</th>
          <th>Content</th>
          <th>Setting</th>
          <th className="text-center">Analytics</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, idx) => (
          <tr key={post.id}>
            <td>{post.id}</td>
            <td>{post.text}</td>
            <td>
              <PostDeleteButton post={post} postIdx={idx} />
            </td>
            <td className="text-center">
              <PieChart
                size={20}
                role="button"
                onClick={() => {
                  toggleGraphicModalVisible(idx);
                }}
              ></PieChart>
              {isGraphicModalVisible[idx] && (
                <AnalyticsModal
                  isGraphicModalVisible={isGraphicModalVisible}
                  toggleGraphicModalVisible={toggleGraphicModalVisible}
                  post={post}
                  postIdx={idx}
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
