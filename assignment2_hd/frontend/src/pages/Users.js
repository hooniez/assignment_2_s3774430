import { useEffect, useState } from "react";
import { getUsers } from "../data/repository";
import { Table, Button } from "react-bootstrap";

export default function Users() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const currentUsers = await getUsers();

    setUsers(currentUsers);
  };

  if (users == null) return null;

  return (
    <div>
      <Table striped>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Access</th>
            <th></th>
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
                <Button variant="danger">Block</Button>
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
    </div>
  );
}
