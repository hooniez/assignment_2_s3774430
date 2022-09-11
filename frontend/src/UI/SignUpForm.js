import { useState } from "react";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { useOutletContext, useNavigate } from "react-router-dom";
import formatDate from "../formatDate";
import MFA from "./MFA";

export default function SignUpForm() {
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPasswordIdentical, setIsPasswordIdentical] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const [isPasswordVisible, setIsPasswordVisble] = useState(false);
  const [isMFAVisible, setIsMFAVisible] = useState(false);

  const [user, setUser] = useState({});

  const [, dispatchUser, users] = useOutletContext();
  const navigate = useNavigate();

  // a list of avatars from whcih to assign to a user
  const avatars = [
    "initials",
    "bottts",
    "avataaars",
    "jdenticon",
    "gridy",
    "micah",
  ];

  /* validation logic */
  function validateEmail(email) {
    return !(email in users);
  }

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

  function confirmPassword(password) {
    return password === document.querySelector("#formSignupPassword").value;
  }
  /* validation logic */

  // timeoutIds for real-time (1s delay) validation handlers
  let validatePasswordTimeoutId;
  let confirmPasswordTimeoutId;
  let validateEmailTimeoutId;

  // The 3 handlers below only validate after timeDelayed microseconds
  const timeDelayed = 1000;
  const validateEmailHandler = (event) => {
    clearTimeout(validateEmailTimeoutId);
    validateEmailTimeoutId = setTimeout(() => {
      setIsEmailValid(validateEmail(event.target.value));
    }, timeDelayed);
  };

  const validatePasswordHandler = (event) => {
    clearTimeout(validatePasswordTimeoutId);
    validatePasswordTimeoutId = setTimeout(() => {
      setIsPasswordValid(validatePassword(event.target.value));
    }, timeDelayed);
  };

  const confirmPasswordHandler = (event) => {
    clearTimeout(confirmPasswordTimeoutId);
    confirmPasswordTimeoutId = setTimeout(() => {
      setIsPasswordIdentical(confirmPassword(event.target.value));
    }, timeDelayed);
  };

  const togglePasswordVisability = () => {
    setIsPasswordVisble(!isPasswordVisible);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    let email = event.target[2].value.toLowerCase();
    let password = event.target[3].value;
    let confirmedPassword = event.target[4].value;

    // Make sure to check whether all the entries are valid once more
    if (
      validateEmail(email) &&
      validatePassword(password) &&
      confirmPassword(confirmedPassword)
    ) {
      setUser({
        ...user,
        firstName: event.target[0].value,
        lastName: event.target[1].value,
        email: email,
        password: confirmedPassword,
        joinedDate: formatDate(),
        avatarsrc: `https://avatars.dicebear.com/api/${
          avatars[Math.floor(Math.random() * avatars.length)]
        }/${email}.svg`,
        posts: [],
      });
      setIsMFAVisible(true);
    } else {
      // If not valid, indicate to the user what inputs are not yet validated.
      setIsEmailValid(validateEmail(email));
      setIsPasswordValid(validatePassword(password));
      setIsPasswordIdentical(confirmPassword(confirmedPassword));
    }
  };

  // The function gets called within MFA if the user has successfully scanned the QR code and typed in the OTP
  const signUpAuthenticatedUser = (secret) => {
    dispatchUser({
      type: "SIGNUP_USER",
      payload: { ...user, secret: secret },
    });
    navigate("/profile");
  };

  return (
    <Container>
      <MFA
        show={isMFAVisible}
        setShow={setIsMFAVisible}
        hideQRcode={false}
        onSuccess={signUpAuthenticatedUser}
        user={user}
      ></MFA>
      <Row>
        <Col lg={{ span: 4, offset: 4 }}>
          <Form className="my-5" onSubmit={submitHandler}>
            <header className="mb-5">
              <h1 className="text-center">Sign up</h1>
            </header>
            <Form.Group className="mb-4" controlId="formSignupFirstName">
              <Form.Label visuallyHidden="true">First name</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="First name"
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formSignupLastName">
              <Form.Label visuallyHidden="true">Last name</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Last name"
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-5" controlId="formSignupEmail">
              <Form.Label visuallyHidden>Email</Form.Label>
              <Form.Control
                type="email"
                required
                placeholder="Email"
                onChange={validateEmailHandler}
                isInvalid={!isEmailValid}
              />
              <Form.Control.Feedback type="invalid">
                The email already exists
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formSignupPassword">
              <Form.Label visuallyHidden>Password</Form.Label>
              <Form.Control
                type={isPasswordVisible ? "text" : "password"}
                required
                placeholder="Password"
                onChange={validatePasswordHandler}
                isInvalid={!isPasswordValid}
              />
              <Form.Control.Feedback type="invalid">
                Use 8 or more character with a mix of lowercase and uppercase
                letters, numbers & symbols
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2" controlId="formSignupPasswordConfirm">
              <Form.Label visuallyHidden="true">Confirm Password</Form.Label>
              <Form.Control
                type={isPasswordVisible ? "text" : "password"}
                required
                placeholder="Confirm"
                isInvalid={!isPasswordIdentical}
                onChange={confirmPasswordHandler}
              />
              <Form.Control.Feedback type="invalid">
                Passwords are not identical
              </Form.Control.Feedback>
              <Form.Text className="text-muted mt-1">
                Use 8 or more character with a mix of lowercase and uppercase
                letters, numbers & symbols
              </Form.Text>
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Form.Check
                type="checkbox"
                label="Show password"
                onClick={togglePasswordVisability}
              />
              <Button variant="primary" type="submit">
                Sign Up
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
