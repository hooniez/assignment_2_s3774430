import { useState } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import logo from "../../logo.png";
import {
  findUser,
  getAllFollowing,
  getAllFollowers,
  verifyUser,
} from "../../data/repository";
import MFA from "./MFA";

export default function Signin() {
  const [isPasswordVisible, setIsPasswordVisble] = useState(false);

  const [isErrorToastVisible, setIsErrorToastVisible] = useState(false);
  const [error, setError] = useState("");
  const [isMFAVisible, setIsMFAVisible] = useState(false);

  const [MFApayload, setMFAPayload] = useState(null);

  const [, dispatchUser] = useOutletContext();
  const navigate = useNavigate();

  const signinWithoutMFA = async (user) => {
    dispatchUser({ type: "SIGNIN_USER", payload: user });

    // Get the ids of all the users whom the logged-in user follows
    const following = await getAllFollowing(user.id);
    dispatchUser({
      type: "UPDATE_FOLLOWING",
      payload: following,
    });

    // Get the ids of all the users who follow the logged-in user
    const followers = await getAllFollowers(user.id);

    dispatchUser({
      type: "UPDATE_FOLLOWERS",
      payload: followers,
    });

    navigate(`/profiles/${user.email}`, {
      state: {
        user: user,
        justLoggedIn: true,
        following: following,
        followers: followers,
      },
    });
  };

  const setupMFA = (user) => {
    setMFAPayload(user);
    setIsMFAVisible(true);
  };

  const signinWithMFA = async () => {
    setIsMFAVisible(false);
    dispatchUser({ type: "SIGNIN_USER", payload: MFApayload });
    navigate(`/profiles/${MFApayload.email}`, {
      state: { user: await findUser(MFApayload.email), justLoggedIn: true },
    });
  };

  const signinSubmitHandler = async (event) => {
    event.preventDefault();
    let email = document.getElementById("formSignInEmail").value.toLowerCase();
    let password = document.getElementById("formSignInPassword").value;

    // Verify that there is a match in db for the email and password entered
    const res = await verifyUser(email, password);
    if (!res.hasOwnProperty("error")) {
      // setupMFA(user);
      signinWithoutMFA(res);
    } else {
      setError(res.error);
      errorToastToggler();
    }
  };

  const togglePasswordVisability = () => {
    setIsPasswordVisble(!isPasswordVisible);
  };

  const errorToastToggler = () => {
    setIsErrorToastVisible(!isErrorToastVisible);
  };

  return (
    <Container className="component">
      {MFApayload !== null && (
        <MFA
          isMFAVisible={isMFAVisible}
          setIsMFAVisible={setIsMFAVisible}
          forComponent={"signin"}
          MFApayload={MFApayload}
          onSuccess={signinWithMFA}
        />
      )}

      <Row>
        <Col lg={{ span: 4, offset: 4 }} className="position-relative">
          <ToastContainer position="top-center">
            <Toast
              show={isErrorToastVisible}
              onClose={errorToastToggler}
              bg="danger"
              delay={2000}
              autohide
            >
              <Toast.Header className="justify-content-between">
                <img src={logo} width="50" height="20" />
              </Toast.Header>
              <Toast.Body className="text-white">
                <strong>{error}</strong>
              </Toast.Body>
            </Toast>
          </ToastContainer>
          <Form className="my-5" onSubmit={signinSubmitHandler}>
            <header className="mb-5">
              <h1 className="text-center">Sign in</h1>
            </header>
            <Form.Group className="mb-3" controlId="formSignInEmail">
              <Form.Label visuallyHidden>Email</Form.Label>
              <Form.Control type="email" required placeholder="Email" />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formSignInPassword">
              <Form.Label visuallyHidden>Password</Form.Label>
              <Form.Control
                type={isPasswordVisible ? "text" : "password"}
                required
                placeholder="Password"
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Form.Check
                type="checkbox"
                label="Show password"
                id="show-password"
                onClick={togglePasswordVisability}
              />
              <Button variant="primary" type="submit">
                Sign In
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
