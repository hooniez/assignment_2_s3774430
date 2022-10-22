import { Button, Container } from "react-bootstrap";
import { unfollow } from "../../data/repository";
import styles from "./UserEntry.module.css";
import { useState } from "react";

export default function UserEntry({
  user,
  children,
  self,
  followingIds,
  setFollowingIds,
  followingUsers,
  setFollowingUsers,
  loggedInUser,
  dispatchUser,
}) {
  const [buttonText, setButtonText] = useState(children);

  const buttonTextChanger = () => {
    if (buttonText === children) {
      setButtonText("Unfollow");
    } else {
      setButtonText(children);
    }
  };

  const unFollowingHandler = async () => {
    let newFollowingIds = followingIds.filter((id) => id !== user.id);
    setFollowingIds(newFollowingIds);
    setFollowingUsers(
      followingUsers.filter((followingUser) => followingUser.id !== user.id)
    );
    await unfollow(loggedInUser.email, user.email);
    dispatchUser({
      type: "UPDATE_FOLLOWING",
      payload: newFollowingIds,
    });
  };
  return (
    <Container>
      <div className="my-3 d-flex justify-content-between align-items-center">
        <div>
          <img
            src={user.avatarSrc}
            className={`${styles.avatar} me-2`}
            alt="avatar"
          />
          <span className="me-2">{`${user.firstName} ${user.lastName}`}</span>
          <small className={styles.greyedOutText}>{user.email}</small>
        </div>

        {children === "Following" && self && (
          <Button
            variant={buttonText === "Following" ? "primary" : "danger"}
            size="sm"
            onClick={unFollowingHandler}
            onMouseEnter={buttonTextChanger}
            onMouseLeave={buttonTextChanger}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </Container>
  );
}
