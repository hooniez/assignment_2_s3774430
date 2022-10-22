import { Button } from "react-bootstrap";
import UsersContext from "../../contexts/UsersContext";
import { useContext } from "react";
import { blockUser } from "../../data/repository";

export default function UserBlockButton({ user }) {
  const { users, dispatchUsers } = useContext(UsersContext);

  const handleBlock = async () => {
    await blockUser(user.id);

    // Find the index corresponding to the user deleted in users from UsersContext
    const idx = users.findIndex((el) => el.id === user.id);

    if (user.isBlocked) {
      dispatchUsers({ type: "UNBLOCK_USER", payload: idx });
    } else {
      dispatchUsers({ type: "BLOCK_USER", payload: idx });
    }
  };

  return (
    <Button
      variant={user.isBlocked ? "success" : "danger"}
      onClick={() => {
        handleBlock();
      }}
    >
      {user.isBlocked ? "Unblock" : "Block"}
    </Button>
  );
}
