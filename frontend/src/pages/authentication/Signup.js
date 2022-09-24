import { useState } from "react";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { useOutletContext, useNavigate } from "react-router-dom";
import formatDate from "../../util/formatDate";
import { createUser, findUser } from "../../data/repository";
import MFA from "./MFA";

export default function Signup() {
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPasswordIdentical, setIsPasswordIdentical] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const [isPasswordVisible, setIsPasswordVisble] = useState(false);
  const [isMFAVisible, setIsMFAVisible] = useState(false);

  const [, dispatchUser] = useOutletContext();
  const [MFApayload, setMFAPayload] = useState(null);
  const navigate = useNavigate();

  // a list of avatars from whcih to assign to a user
  const avatars = [
    "initials",
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

  /* validation logic */
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
    validateEmailTimeoutId = setTimeout(async () => {
      setIsEmailValid((await findUser(event.target.value)) === null);
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

  const signupWithoutMFA = async (payload) => {
    await createUser(payload);
    dispatchUser({
      type: "SIGNIN_USER",
      payload: payload,
    });
    navigate("/profile", { state: { justLoggedIn: true } });
  };

  const signupSubmitHandler = async (event) => {
    event.preventDefault();

    let email = document.getElementById("formSignupEmail").value.toLowerCase();
    let password = document.getElementById("formSignupPassword").value;
    let confirmedPassword = document.getElementById(
      "formSignupPasswordConfirm"
    ).value;

    // Make sure to check whether all the entries are valid once more
    if (validatePassword(password) && confirmPassword(confirmedPassword)) {
      let payload = {
        email: email,
        firstName: document.getElementById("formSignupFirstName").value,
        lastName: document.getElementById("formSignupLastName").value,
        password: confirmedPassword,
        dateJoined: formatDate(),
        avatarSrc: `https://avatars.dicebear.com/api/${
          avatars[Math.floor(Math.random() * avatars.length)]
        }/${email}.svg`,
        isBlocked: false,
        secretKey: null,
      };
      signupWithoutMFA(payload);
      // setupMFA(payload);
    } else {
      // If not valid, indicate to the user what inputs are not yet validated.
      setIsPasswordValid(validatePassword(password));
      setIsPasswordIdentical(confirmPassword(confirmedPassword));
    }
  };

  const setupMFA = async (payload) => {
    setMFAPayload(payload);
    setIsMFAVisible(true);
  };

  // The function gets called within MFA if the user has successfully scanned the QR code and typed in the OTP
  const signupWithMFA = async (secretKey) => {
    await createUser({ ...MFApayload, secretKey: secretKey });
    dispatchUser({
      type: "SIGNIN_USER",
      payload: { ...MFApayload, secretKey: secretKey },
    });
    navigate("/profile", { state: { justLoggedIn: true } });
  };

  return (
    <Container className="component">
      {MFApayload != null && (
        <MFA
          isMFAVisible={isMFAVisible}
          setIsMFAVisible={setIsMFAVisible}
          forComponent={"signup"}
          MFApayload={MFApayload}
          onSuccess={signupWithMFA}
        ></MFA>
      )}

      <Row>
        <Col lg={{ span: 4, offset: 4 }}>
          <Form className="my-5" onSubmit={signupSubmitHandler}>
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
              {!isPasswordIdentical && (
                <Form.Control.Feedback type="invalid">
                  Passwords are not identical
                </Form.Control.Feedback>
              )}

              <Form.Text className="text-muted mt-1">
                Use 8 or more character with a mix of lowercase and uppercase
                letters, numbers & symbols
              </Form.Text>
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Form.Check
                type="checkbox"
                label="Show password"
                id="show-password"
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
