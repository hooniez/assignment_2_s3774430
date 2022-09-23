import { useState, useRef, useEffect } from "react";
import {
  Card,
  Container,
  Form,
  Tabs,
  Tab,
  Button,
  Modal,
  Row,
  Col,
  Spinner,
  Carousel,
  CarouselItem,
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
  Shuffle,
  TrashFill,
} from "react-bootstrap-icons";
import logo from "../../logo.png";
import styles from "./Profile.module.css";
import { deleteUser, editUser, verifyUser } from "../../data/repository";

export default function Profile() {
  const [user, dispatchUser, ,] = useOutletContext();
  const [editHidden, setEditHidden] = useState(true);
  const [deleteModalHidden, setDeleteModalHidden] = useState(true);
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);
  const [avatarUrls, setAvatarUrls] = useState([user.data.avatarSrc]);
  const [currAvatarIdx, setCurrAvatarIdx] = useState(0);
  const [passwordInputHidden, setPasswordInputHidden] = useState(true);
  const [isPasswordIdentical, setIsPasswordIdentical] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPasswordVisible, setIsPasswordVisble] = useState(false);
  const [isPasswordMatched, setIsPasswordMatched] = useState(true);
  const { state } = useLocation();
  const [welcomeToastVisible, setWelcomeToastVisible] = useState(
    state == null ? false : state.justLoggedIn
  );

  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const submitButtonRef = useRef(null);

  const navigate = useNavigate();

  const editShowHandler = (event) => {
    setEditHidden(!editHidden);
  };

  const welcomeToastToggler = () => {
    setWelcomeToastVisible(!welcomeToastVisible);
  };

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
        firstName: event.target[0].value,
        lastName: event.target[1].value,
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
      console.log(currUser);
      if (currUser !== null) {
        console.log("hello");
        payload = {
          ...payload,
          firstName: event.target[0].value,
          lastName: event.target[1].value,
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
        setIsPasswordMatched(false);
      }
    }
    setIsSpinnerVisible(false);
  };

  const deleteHandler = async () => {
    await deleteUser(user.data.email);
    dispatchUser({
      type: "DELETE_USER",
    });
    navigate("/");
  };

  const confirmDeleteHandler = () => setDeleteModalHidden(false);
  const closeDeleteHandler = () => setDeleteModalHidden(true);

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

  const togglePasswordInputVisibility = () => {
    setPasswordInputHidden(!passwordInputHidden);
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

  return (
    <Container>
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
        <Col
          xs={{ span: 10, offset: 1 }}
          sm={{ span: 8, offset: 2 }}
          lg={{ span: 6, offset: 3 }}
          xl={{ span: 4, offset: 4 }}
        >
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
                  <img src={logo} width="50" height="20" />
                </Toast.Header>
                <Toast.Body className="text-white">
                  <strong>{`Welcome, ${user.data.firstName}!`}</strong>
                </Toast.Body>
              </Toast>
            </ToastContainer>
            <Card.Header className="d-flex justify-content-between align-items-center">
              {editHidden ? <h1>Profile</h1> : <h1>Edit</h1>}

              <div>
                {editHidden ? (
                  <PencilFill
                    className={`${styles.icons} ${styles.pencil}`}
                    color="royalblue"
                    role="button"
                    onClick={editShowHandler}
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
            </Card.Header>
            <div className="position-relative d-flex justify-content-center">
              <ChevronCompactLeft
                className={`${styles.chevronCompact} ${styles.chevronCompactLeft}`}
                role="button"
                hidden={editHidden}
                onClick={prependAvatarUrlHandler}
              ></ChevronCompactLeft>
              <img
                variant="top"
                src={avatarUrls[currAvatarIdx]}
                className={`mt-5 ${styles.avatar}`}
                alt="Avatar"
              />
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
                  {user.data.firstName + " " + user.data.lastName}
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
                      defaultValue={user.data.firstName}
                    ></Form.Control>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEditLastName">
                  <FloatingLabel controlId="floatingLastName" label="Last Name">
                    <Form.Control
                      type="text"
                      required
                      defaultValue={user.data.lastName}
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
                  <hr />
                  <Card.Subtitle className="mb-2 text-muted">
                    {user.data.email}
                  </Card.Subtitle>
                  <hr />
                  <Card.Text>
                    Joined: {new Date(user.data.dateJoined).toDateString()}
                  </Card.Text>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
