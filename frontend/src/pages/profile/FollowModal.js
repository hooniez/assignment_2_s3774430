import { Modal, Tabs, Tab } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getUsers } from "../../data/repository";
import UserEntry from "./UserEntry";
import { FilePdf } from "react-bootstrap-icons";

export default function FollowModal({
  followModalToggler,
  followModalVisible,
  user,
  followingIds,
  setFollowingIds,
  followersIds,
  setFollowersIds,
  self,
  loggedInUser,
  dispatchUser,
}) {
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followerUsers, setFollowerUsers] = useState([]);

  async function getFollowingUsers(ids) {
    if (ids.length !== 0) {
      setFollowingUsers(await getUsers(ids));
    }
  }

  async function getFollowedUsers(ids) {
    setFollowerUsers(await getUsers(ids));
  }

  // Load initial data
  useEffect(() => {
    getFollowingUsers(followingIds);
    getFollowedUsers(followersIds);
  }, []);

  return (
    <Modal show={followModalVisible} onHide={followModalToggler}>
      <Modal.Header closeButton>
        <div className="d-flex-column">
          <Modal.Title>
            <div>{`${user.firstName} ${user.lastName}`}</div>
          </Modal.Title>
          <small>{`${user.email}`}</small>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Tabs fill>
          <Tab eventKey="Following" title="Following">
            {followingUsers.map((user) => (
              <UserEntry
                key={user.id}
                user={user}
                self={self}
                setFollowingIds={setFollowingIds}
                followingIds={followingIds}
                followingUsers={followingUsers}
                setFollowingUsers={setFollowingUsers}
                loggedInUser={loggedInUser}
                dispatchUser={dispatchUser}
              >
                Following
              </UserEntry>
            ))}
          </Tab>
          <Tab eventKey="Followers" title="Followers">
            {followerUsers.map((user) => (
              <UserEntry key={user.id} user={user}></UserEntry>
            ))}
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}
