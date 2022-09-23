import { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { findUser, verifyUser } from "../data/repository";
import MFA from "../fragments/MFA";

export default function SignInForm() {
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordMatched, setIsPasswordMatched] = useState(true);

  const [isPasswordVisible, setIsPasswordVisble] = useState(false);
  const [isMFAVisible, setIsMFAVisible] = useState(false);

  const [user, setUser] = useState({});

  const [, dispatchUser, users] = useOutletContext();
  const navigate = useNavigate();

  let validateEmailTimeoutId;

  const timeDelayed = 1000;
  const validateEmailHandler = (event) => {
    clearTimeout(validateEmailTimeoutId);
    validateEmailTimeoutId = setTimeout(async () => {
      setIsEmailValid((await findUser(event.target.value)) !== null);
    }, timeDelayed);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    let email = event.target[0].value.toLowerCase();
    let password = event.target[1].value;

    // Verify that there is a match in db for the email and password entered
    const user = await verifyUser(email, password);

    if (user !== null) {
      setUser(user);
      setIsPasswordMatched(true);
      setIsEmailValid(true);
      dispatchUser({ type: "SIGNIN_USER", payload: user });
      navigate("/profile", {state: {justLoggedIn: true}});
    } else {
      setIsPasswordMatched(false);
    }
  };

  // The function gets called within MFA if the user has successfully typed in the OTP
  const signInAuthenticatedUser = () => {
    setIsMFAVisible(false);
    dispatchUser({ type: "SIGNIN_USER", payload: users[user.email] });
    setIsMFAVisible(false);
    navigate("/profile", {state: {justLoggedIn: true}});
  };

  // const submitHandler = async (event) => {
  //   event.preventDefault();
  //   let email = event.target[0].value.toLowerCase();
  //   let password = event.target[1].value;

  //   // Verify that there is a match in db for the email and password entered
  //   const user = await verifyUser(email, password);
  //   console.log(user);

  //   if (user !== null) {
  //     console.log("hello");
  //     setUser({ ...user });
  //     setIsPasswordMatched(true);
  //     setIsEmailValid(true);
  //     setIsMFAVisible(true);
  //   }

  //   // else {
  //   //     // Password doesn't match
  //   //     setIsEmailValid(true);
  //   //     setIsPasswordMatched(false);
  //   //   }
  //   // } else {
  //   //   // Email doesn't exist
  //   //   setIsEmailValid(false);
  //   //   setIsPasswordMatched(true);
  //   // }
  // };

  // // The function gets called within MFA if the user has successfully typed in the OTP
  // const signInAuthenticatedUser = () => {
  //   setIsMFAVisible(false);
  //   dispatchUser({ type: "SIGNIN_USER", payload: users[user.email] });
  //   setIsMFAVisible(false);
  //   navigate("/profile");
  // };

  const togglePasswordVisability = () => {
    setIsPasswordVisble(!isPasswordVisible);
  };

  return (
    <Container className="component">
      <MFA
        show={isMFAVisible}
        setShow={setIsMFAVisible}
        hideQRcode={true}
        onSuccess={signInAuthenticatedUser}
        user={user}
      />
      <Row>
        <Col lg={{ span: 4, offset: 4 }}>
          <Form className="my-5" onSubmit={submitHandler}>
            <header className="mb-5">
              <h1 className="text-center">Sign in</h1>
            </header>
            <Form.Group className="mb-3" controlId="formSignInEmail">
              <Form.Label visuallyHidden>Email</Form.Label>
              <Form.Control
                type="email"
                required
                placeholder="Email"
                isInvalid={!isEmailValid}
                onChange={validateEmailHandler}
              />
              <Form.Control.Feedback type="invalid">
                The email doesn't exist
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formSignInPassword">
              <Form.Label visuallyHidden>Password</Form.Label>
              <Form.Control
                type={isPasswordVisible ? "text" : "password"}
                required
                placeholder="Password"
                isInvalid={!isPasswordMatched}
              />
              <Form.Control.Feedback type="invalid">
                The password doesn't match
              </Form.Control.Feedback>
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
