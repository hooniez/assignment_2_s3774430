import { useState, useRef, useEffect } from "react";
import {
  Card,
  Container,
  Form,
  Button,
  Modal,
  Row,
  Col,
  Spinner,
  FloatingLabel,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronCompactLeft,
  ChevronCompactRight,
  PencilFill,
  PersonCircle,
  TrashFill,
} from "react-bootstrap-icons";
import logo from "../../logo.png";
import styles from "./Profile.module.css";
import {
  deleteUser,
  editUser,
  verifyUser,
  follow,
  unfollow,
} from "../../data/repository";
import Posts from "../forum/Posts";
import FollowModal from "./FollowModal";

export default function Profile() {
  const [user, dispatchUser, ,] = useOutletContext();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [editHidden, setEditHidden] = useState(true);
  const [deleteModalHidden, setDeleteModalHidden] = useState(true);
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);
  const [passwordInputHidden, setPasswordInputHidden] = useState(true);
  const [isPasswordIdentical, setIsPasswordIdentical] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPasswordMatched, setIsPasswordMatched] = useState(true);
  const [followModalVisible, setFollowModalVisible] = useState(false);
  const [welcomeToastVisible, setWelcomeToastVisible] = useState(
    state.justLoggedIn
  );
  const [currAvatarIdx, setCurrAvatarIdx] = useState(0);
  const [avatarUrls, setAvatarUrls] = useState(
    user.data?.id === state.user.id
      ? [user.data?.avatarSrc]
      : [state.user.avatarSrc]
  );
  // States related to follow
  const [isFollowed, setIsFollowed] = useState(
    user.following?.includes(state.user.id)
  );
  const [following, setFollowing] = useState(
    user.data?.id === state.user.id ? user.following : state.following
  );
  const [followers, setFollowers] = useState(
    user.data?.id === state.user.id ? user.followers : state.followers
  );
  const [followTab, setFollowTab] = useState(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const submitButtonRef = useRef(null);

  // From another profile page, clicking a NavLink may not update these states. Manually update them when state.user is changed.
  useEffect(() => {
    setAvatarUrls([state.user.avatarSrc]);
    setFollowing(state.following);
    setFollowers(state.followers);
  }, [state.user, state.following, state.followers]);

  // Visibility togglers
  const editShowHandler = () => setEditHidden(!editHidden);
  const welcomeToastToggler = () =>
    setWelcomeToastVisible(!welcomeToastVisible);
  const togglePasswordInputVisibility = () =>
    setPasswordInputHidden(!passwordInputHidden);
  const confirmDeleteHandler = () => setDeleteModalHidden(false);
  const closeDeleteHandler = () => setDeleteModalHidden(true);
  const followModalToggler = (tabName) => {
    setFollowModalVisible(!followModalVisible);
    setFollowTab(tabName);
  };

  // Validation logic
  function validatePassword(password) {
    /* A regex pattern that matches invalid passwords
        - Anything with less than eight characters OR
        - Anything with no numbers OR
        - Anything with no uppercase letter OR
        - Anything with no lowercase letter OR
        - Anything with no special characters
    */
    const regex = "^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$";
    // If there are any matches, the password is invalid
    return password.match(regex) ? false : true;
  }

  function confirmPassword() {
    return newPasswordRef.current.value === confirmPasswordRef.current.value;
  }

  let confirmPasswordTimeoutId;
  let validatePasswordTimeoutId;
  const timeDelayed = 1000;

  const confirmPasswordHandler = (event) => {
    // // Only enable the handler when both input fields have values
    if (
      newPasswordRef.current.value.length !== 0 &&
      confirmPasswordRef.current.value.length !== 0
    ) {
      clearTimeout(confirmPasswordTimeoutId);
      confirmPasswordTimeoutId = setTimeout(() => {
        setIsPasswordIdentical(confirmPassword());
      }, timeDelayed);
    }
  };

  const validatePasswordHandler = (event) => {
    clearTimeout(validatePasswordTimeoutId);
    validatePasswordTimeoutId = setTimeout(() => {
      setIsPasswordValid(validatePassword(event.target.value));
      // If there is a value filled for confirmPassword, additionally check whether they are identical
      if (confirmPasswordRef.current.value.length !== 0) {
        setIsPasswordIdentical(confirmPassword());
      }
    }, timeDelayed);
  };

  const clickSubmitButton = () => {
    submitButtonRef.current.click();
  };

  const editHandler = async (event) => {
    event.preventDefault();
    setIsSpinnerVisible(true);
    let payload = { email: user.data.email };

    // If anything but password is being udpated
    if (passwordInputHidden) {
      payload = {
        ...payload,
        firstName: document.getElementById("floatingFirstName").value,
        lastName: document.getElementById("floatingLastName").value,
        avatarSrc: avatarUrls[currAvatarIdx],
      };
      await editUser(payload);
      dispatchUser({
        type: "EDIT_USER",
        payload: { ...user.data, ...payload },
      });
      setEditHidden(!editHidden);
      setIsPasswordMatched(true);
      event.target.reset();
    } else {
      // If the password is being updated

      const password = event.target[3].value;

      const currUser = await verifyUser(user.data.email, password);
      if (currUser !== null) {
        payload = {
          ...payload,
          firstName: document.getElementById("floatingFirstName").value,
          lastName: document.getElementById("floatingLastName").value,
          avatarSrc: avatarUrls[currAvatarIdx],
          password: event.target[4].value,
        };
        await editUser(payload);
        dispatchUser({
          type: "EDIT_USER",
          payload: { ...user.data, ...payload },
        });
        setEditHidden(!editHidden);
        setIsPasswordMatched(true);
        event.target.reset();
      } else {
        // If the verification fails
        setIsPasswordMatched(false);
      }
    }
    setIsSpinnerVisible(false);
  };

  const deleteHandler = async () => {
    await deleteUser(user.data.email);
    dispatchUser({
      type: "SIGNOUT_USER",
    });
    navigate("/");
  };

  // a list of avatars from whcih to assign to a user
  const avatars = [
    "bottts",
    "avataaars",
    "jdenticon",
    "gridy",
    "micah",
    "adventurer",
    "big-ears",
    "big-smile",
    "micah",
    "open-peeps",
    "personas",
    "miniavs",
  ];

  const prependAvatarUrlHandler = () => {
    if (currAvatarIdx === 0) {
      setAvatarUrls([pickRandomAvatar(), ...avatarUrls]);
      setCurrAvatarIdx(currAvatarIdx);
    } else {
      setCurrAvatarIdx(currAvatarIdx - 1);
    }
  };

  const appendAvatarUrlHandler = () => {
    if (currAvatarIdx === avatarUrls.length - 1) {
      setAvatarUrls([...avatarUrls, pickRandomAvatar()]);
    }
    setCurrAvatarIdx(currAvatarIdx + 1);
  };

  const pickRandomAvatar = () => {
    return `https://avatars.dicebear.com/api/${
      avatars[Math.floor(Math.random() * avatars.length)]
    }/${Math.random()}.svg`;
  };

  const getMonthAndYear = () => {
    let dateUnits = new Date(state.user.dateJoined).toDateString().split(" ");
    return dateUnits[1] + " " + dateUnits[3];
  };

  const followHandler = async () => {
    if (!isFollowed) {
      await follow(user.data.email, state.user.email);
      dispatchUser({
        type: "UPDATE_FOLLOWING",
        payload: [...user.following, state.user.id],
      });
      setIsFollowed(true);
      setFollowers([...followers, user.data.id]);
    } else {
      await unfollow(user.data.email, state.user.email);
      dispatchUser({
        type: "UPDATE_FOLLOWING",
        payload: user.following.filter((id) => id !== state.user.id),
      });
      setIsFollowed(false);
      setFollowers(
        followers.filter((followerId) => followerId !== user.data.id)
      );
    }
  };

  return (
    <Container key={state.user.id}>
      <Modal show={!deleteModalHidden} onHide={closeDeleteHandler}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>Confirm to delete your account.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteHandler}>
            Close
          </Button>
          <Button variant="danger" onClick={deleteHandler}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Row className={`${styles.row} py-5`}>
        <Col lg={{ span: 6, offset: 3 }}>
          <Card className="position-relative">
            <ToastContainer position="top-center">
              <Toast
                show={welcomeToastVisible}
                onClose={welcomeToastToggler}
                bg="success"
                delay={2000}
                autohide
              >
                <Toast.Header className="justify-content-between">
                  <img src={logo} alt="logo" width="50" height="20" />
                </Toast.Header>
                <Toast.Body className="text-white">
                  <strong>{`Welcome, ${user.data?.firstName}!`}</strong>
                </Toast.Body>
              </Toast>
            </ToastContainer>
            <Card.Header className="d-flex justify-content-end align-items-center">
              {user.data?.id === state.user.id && (
                <div>
                  {editHidden ? (
                    <PencilFill
                      className={`${styles.icons} ${styles.pencil}`}
                      color="royalblue"
                      role="button"
                      onClick={editShowHandler}
                      data-test-icon="pencil"
                    />
                  ) : (
                    <PersonCircle
                      className={`${styles.icons} ${styles.pencil}`}
                      color="royalblue"
                      role="button"
                      onClick={clickSubmitButton}
                    />
                  )}

                  <TrashFill
                    className={styles.icons}
                    onClick={confirmDeleteHandler}
                    color="royalblue"
                    role="button"
                  />
                </div>
              )}
            </Card.Header>
            <div
              className={`position-relative d-flex pt-4 ${
                editHidden
                  ? "justify-content-between px-4"
                  : "justify-content-center"
              }`}
            >
              <ChevronCompactLeft
                className={`${styles.chevronCompact} ${styles.chevronCompactLeft}`}
                role="button"
                hidden={editHidden}
                onClick={prependAvatarUrlHandler}
              ></ChevronCompactLeft>
              <img
                variant="top"
                src={avatarUrls[currAvatarIdx]}
                className={`${styles.avatar}`}
                alt="Avatar"
              />
              {user.data?.id !== state.user.id && (
                <div hidden={!editHidden}>
                  <Button className="btn-secondary" onClick={followHandler}>
                    {isFollowed ? "Unfollow" : "Follow"}
                  </Button>
                </div>
              )}

              <ChevronCompactRight
                className={`${styles.chevronCompact} ${styles.chevronCompactRight}`}
                role="button"
                hidden={editHidden}
                onClick={appendAvatarUrlHandler}
              ></ChevronCompactRight>
            </div>

            <Card.Body>
              <Card.Title>
                <h2 hidden={!editHidden}>
                  {user.data?.id === state.user.id
                    ? user.data?.firstName + " " + user.data?.lastName
                    : state.user.firstName + " " + state.user.lastName}
                </h2>
              </Card.Title>
              <Form className="my-5" hidden={editHidden} onSubmit={editHandler}>
                <Form.Group className="mb-3" controlId="formEditFirstName">
                  <Form.Label visuallyHidden="true">First name</Form.Label>
                  <FloatingLabel
                    controlId="floatingFirstName"
                    label="First Name"
                  >
                    <Form.Control
                      type="text"
                      required
                      defaultValue={user.data?.firstName}
                    ></Form.Control>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEditLastName">
                  <FloatingLabel controlId="floatingLastName" label="Last Name">
                    <Form.Control
                      type="text"
                      required
                      defaultValue={user.data?.lastName}
                    ></Form.Control>
                  </FloatingLabel>
                </Form.Group>
                <Form.Check
                  className="mb-3"
                  type="checkbox"
                  label="Edit Password"
                  id="checkboxEditPassword"
                  onClick={togglePasswordInputVisibility}
                ></Form.Check>

                {!passwordInputHidden && (
                  <>
                    <Form.Group
                      className="mb-3"
                      controlId="formEditCurrentPassword"
                    >
                      <FloatingLabel
                        controlId="floatingCurrentPassword"
                        label="Current Password"
                      >
                        <Form.Control
                          type="password"
                          isInvalid={!isPasswordMatched}
                          required
                        ></Form.Control>
                        <Form.Control.Feedback type="invalid">
                          The password doesn't match
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="formEditNewPassword"
                    >
                      <FloatingLabel
                        controlId="floatingNewPassword"
                        label="New Password"
                      >
                        <Form.Control
                          type="password"
                          ref={newPasswordRef}
                          onChange={validatePasswordHandler}
                          isInvalid={!isPasswordValid}
                          required
                        ></Form.Control>
                        <Form.Control.Feedback type="invalid">
                          Use 8 or more character with a mix of lowercase and
                          uppercase letters, numbers & symbols
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="formEditConfirmPassword"
                    >
                      <FloatingLabel
                        controlId="floatingConfirmPassword"
                        label="Confirm Password"
                      >
                        <Form.Control
                          type="password"
                          ref={confirmPasswordRef}
                          onChange={confirmPasswordHandler}
                          isInvalid={!isPasswordIdentical}
                          required
                        />
                        <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  </>
                )}

                <Container>
                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSpinnerVisible}
                      ref={submitButtonRef}
                    >
                      {isSpinnerVisible ? (
                        <Spinner
                          as="span"
                          size="sm"
                          animation="border"
                          role="status"
                        ></Spinner>
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                </Container>
              </Form>

              {editHidden && (
                <>
                  <Card.Subtitle className="mb-4 text-muted">
                    {user.data?.id === state.user.id
                      ? user.data?.email
                      : state.user.email}
                  </Card.Subtitle>

                  <Card.Subtitle className="mb-4 text-muted">
                    Joined: {getMonthAndYear()}
                  </Card.Subtitle>
                  <Card.Subtitle className="d-flex">
                    <div
                      role="button"
                      className="me-2"
                      onClick={() => followModalToggler("Following")}
                    >
                      <strong>{following?.length}</strong>
                      <small className="text-muted"> Following</small>
                    </div>
                    <div
                      role="button"
                      onClick={() => followModalToggler("Followers")}
                    >
                      <strong>{followers?.length}</strong>
                      <small className="text-muted"> Followers</small>
                    </div>
                    {followModalVisible && (
                      <FollowModal
                        activeKey={followTab}
                        followModalVisible={followModalVisible}
                        followModalToggler={followModalToggler}
                        user={state.user}
                        self={user.data.id === state.user.id}
                        followingIds={following}
                        setFollowingIds={setFollowing}
                        followersIds={followers}
                        setFollowersIds={setFollowers}
                        loggedInUser={user.data}
                        dispatchUser={dispatchUser}
                      ></FollowModal>
                    )}
                  </Card.Subtitle>
                </>
              )}
            </Card.Body>
          </Card>
          {(isFollowed || user.data?.id === state.user.id) && (
            <Posts
              onProfile={true}
              profileUser={state.user}
              user={user.data}
            ></Posts>
          )}
        </Col>
      </Row>
    </Container>
  );
}
