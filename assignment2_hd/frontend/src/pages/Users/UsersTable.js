import { Table, Button } from "react-bootstrap";
import UsersContext from "../../contexts/UsersContext";
import { useContext } from "react";
import UserBlockButton from "./UserBlockButton";

export default function UsersTable() {
  const { users, dispatchUsers } = useContext(UsersContext);

  return (
    <Table striped>
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Access</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.email}>
            <td>{user.email}</td>
            <td>
              {user.firstName} {user.lastName}
            </td>
            <td>
              <UserBlockButton user={user} />
            </td>
            {/* <td>
              <Link className="btn btn-primary" to={`/edit/${user.email}`}>Edit User</Link>
            </td>
            <td>
              <button className="btn btn-danger" onClick={() => handleDelete(owner.email)}>Delete</button>
            </td> */}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
