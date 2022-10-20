import { Table, Button } from "react-bootstrap";
import UsersContext from "../../contexts/UsersContext";
import { useContext, useEffect, useState } from "react";
import UserBlockButton from "./UserBlockButton";
import { PieChart } from "react-bootstrap-icons";
import AnalyticsModalUsers from "./AnalyticsModalUsers";

export default function UsersTable() {
  const { users, dispatchUsers } = useContext(UsersContext);
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
    for (let i = 0; i < users.length; i++) {
      arr.push(false);
    }

    setIsGraphicModalVisible([...arr]);
  }, [users.length]);

  return (
    <Table striped>
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Access</th>
          <th className="text-center">Analytics</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, idx) => (
          <tr key={user.email}>
            <td>{user.email}</td>
            <td>
              {user.firstName} {user.lastName}
            </td>
            <td>
              <UserBlockButton user={user} />
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
                <AnalyticsModalUsers
                  isGraphicModalVisible={isGraphicModalVisible}
                  toggleGraphicModalVisible={toggleGraphicModalVisible}
                  user={user}
                  userIdx={idx}
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
