import { Table, Button } from "react-bootstrap";
import PostsContext from "../../contexts/PostsContext";
import { useContext, useState } from "react";
import PostDeleteButton from "./PostDeleteButton";
import { PieChart } from "react-bootstrap-icons";
import AnalyticsModal from "../../fragments/AnalyticsModal";

export default function PostsTable() {
  const { posts, dispatchPosts } = useContext(PostsContext);
  const [isGraphicModalVisible, setIsGraphicModalVisible] = useState(false);

  const toggleGraphicModalVisible = () => {
    setIsGraphicModalVisible(!isGraphicModalVisible);
  };

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
        {posts.map((post) => (
          <tr key={post.id}>
            <td>{post.id}</td>
            <td>{post.text}</td>
            <td>
              <PostDeleteButton post={post} />
            </td>
            <td className="text-center">
              <PieChart
                size={20}
                role="button"
                onClick={toggleGraphicModalVisible}
              ></PieChart>
              <AnalyticsModal
                isGraphicModalVisible={isGraphicModalVisible}
                toggleGraphicModalVisible={toggleGraphicModalVisible}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
