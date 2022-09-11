import { useState } from "react";
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
} from "react-bootstrap";
import { useOutletContext, useNavigate } from "react-router-dom";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import styles from "./Profile.module.css";

export default function Profile() {
  const [user, dispatchUser, , deleteUser] = useOutletContext();
  const [editHidden, setEditHidden] = useState(true);
  const [deleteModalHidden, setDeleteModalHidden] = useState(true);
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);
  const navigate = useNavigate();

  const editShowHandler = (event) => {
    setEditHidden(!editHidden);
  };

  const editNameHandler = (event) => {
    setIsSpinnerVisible(true);
    dispatchUser({
      type: "EDIT_USER",
      payload: {
        ...user.data,
        firstName: event.target[0].value,
        lastName: event.target[1].value,
      },
    });
    setTimeout(() => {
      setIsSpinnerVisible(false);
      setEditHidden(!editHidden);
    }, 1000);
  };

  const deleteHandler = () => {
    deleteUser(user.data.email);
    dispatchUser({
      type: "DELETE_USER",
    });
    navigate("/");
  };

  const confirmDeleteHandler = () => setDeleteModalHidden(false);
  const closeDeleteHandler = () => setDeleteModalHidden(true);

  return (
    <>
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
      <Row className="my-5">
        <Col
          xs={{ span: 10, offset: 1 }}
          sm={{ span: 8, offset: 2 }}
          lg={{ span: 6, offset: 3 }}
          xl={{ span: 4, offset: 4 }}
        >
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h1>Profile</h1>
              <div>
                <PencilFill
                  className={`${styles.icons} ${styles.pencil}`}
                  color="royalblue"
                  role="button"
                  onClick={editShowHandler}
                />

                <TrashFill
                  className={styles.icons}
                  onClick={confirmDeleteHandler}
                  color="royalblue"
                  role="button"
                />
              </div>
            </Card.Header>

            <img
              variant="top"
              src={user.data.avatarsrc}
              hidden={!editHidden}
              className="m-5"
              alt="Avatar"
            />
            <Card.Body>
              <Card.Title>
                <h2 hidden={!editHidden}>
                  {user.data.firstName + " " + user.data.lastName}
                </h2>
                <Tabs
                  className="my-5"
                  defaultActiveKey="name"
                  justify
                  hidden={editHidden}
                >
                  {/* <Tab eventKey="avatar" title="Avatar"></Tab> */}
                  <Tab eventKey="name" title="Name">
                    <Form
                      className="my-5"
                      hidden={editHidden}
                      onSubmit={editNameHandler}
                    >
                      <Form.Group
                        className="mb-3"
                        controlId="formEditFirstName"
                      >
                        <Form.Label visuallyHidden="true">
                          First name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          required
                          defaultValue={user.data.firstName}
                        ></Form.Control>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formEditLastName">
                        <Form.Label visuallyHidden="true">Last name</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          defaultValue={user.data.lastName}
                        ></Form.Control>
                      </Form.Group>
                      <Container>
                        <div className="d-grid">
                          <Button
                            variant="primary"
                            type="submit"
                            disabled={isSpinnerVisible}
                          >
                            {isSpinnerVisible ? (
                              <Spinner
                                as="span"
                                size="sm"
                                animation="border"
                                role="status"
                              ></Spinner>
                            ) : (
                              "Edit"
                            )}
                          </Button>
                        </div>
                      </Container>
                    </Form>
                  </Tab>
                  {/* <Tab eventKey="password" title="Password">
                <PasswordInput></PasswordInput>
              </Tab> */}
                </Tabs>
              </Card.Title>

              <hr />
              <Card.Subtitle className="mb-2 text-muted">
                {user.data.email}
              </Card.Subtitle>
              <hr />
              <Card.Text>Joined: {user.data.joinedDate}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
