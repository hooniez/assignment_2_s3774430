import { useState, useEffect } from "react";
import { Form, Button, Modal, Spinner } from "react-bootstrap";
import axios from "axios";
import Loading from "../fragments/Loading";

export default function MFA({ show, setShow, onSuccess, hideQRcode, user }) {
  // When the prop hideQRcode is true, MFA is used in SignInForm
  const [qrcodeSrc, setQrcodeSrc] = useState("");
  const [secret, setSecret] = useState(user.secret);
  const [isOTPcorrect, setIsOTPcorrect] = useState(true);
  const [isLoadingVisible, setIsLoadingVisible] = useState(false);
  const url = "https://google-authenticator.p.rapidapi.com";
  const apiKey = "414bc5d180msh86e5db53aea8bbcp1bcd81jsn6915fb5401f0";

  async function getQrCode() {
    // options for the initial request to get a secret key
    let res;
    let options = {
      method: "GET",
      url: url + "/new_v2/",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "google-authenticator.p.rapidapi.com",
      },
    };
    res = await axios.request(options);
    let secretKey = res.data;
    setSecret(secretKey);

    // Re-define options again to make a request to get a QR code.
    options = {
      method: "GET",
      url: url + "/enroll/",
      params: {
        secret: secretKey,
        issuer: "lan",
        account: `${user.firstName} ${user.lastName}`,
      },
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "google-authenticator.p.rapidapi.com",
      },
    };
    res = await axios.request(options);
    setQrcodeSrc(res.data);
  }

  useEffect(() => {
    if (show) {
      // If sign-in
      if (hideQRcode) {
        setSecret(user.secret);
      } else {
        getQrCode();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const submitHandler = (e) => {
    e.preventDefault();
    setIsLoadingVisible(true);
    const code = e.target[0].value;

    const options = {
      method: "GET",
      url: url + "/validate/",
      params: { code: code, secret: secret },
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "google-authenticator.p.rapidapi.com",
      },
    };

    axios.request(options).then((response) => {
      if (response.data === "True") {
        if (hideQRcode) {
          onSuccess();
        } else {
          onSuccess(secret);
        }
        setIsOTPcorrect(true);
        setShow(false);
        setIsLoadingVisible(false);
      } else {
        setIsOTPcorrect(false);
        setIsLoadingVisible(false);
      }
    });
  };

  const handleClose = () => {
    setShow(false);
    setIsOTPcorrect(true);
  };

  const modalJSX = () => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="text-center" hidden={hideQRcode}>
          Scan the QR code in Google Authenticator
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex-column">
        <div className="d-flex justify-content-center" hidden={hideQRcode}>
          {qrcodeSrc === "" ? (
            <Spinner animation="border" role="status" className="my-3">
              <span className="visually-hidden">Spinner</span>
            </Spinner>
          ) : (
            <img className="my-3" src={qrcodeSrc} alt="QR code" />
          )}
        </div>
        <div className="d-flex justify-content-center">
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3 text-center" controlId="authCode">
              <Form.Control
                type="text"
                required
                isInvalid={!isOTPcorrect}
                placeholder="One Time PIN"
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                The OTP is incorrect
              </Form.Control.Feedback>
            </Form.Group>
            <div className="text-center">
              <Button type="submit">Authenticate</Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );

  return (
    <>
      {isLoadingVisible ? (
        <Loading show={isLoadingVisible}>Logging in</Loading>
      ) : (
        modalJSX()
      )}
    </>
  );
}
