import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Container,
  ProgressBar,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Image } from "react-bootstrap-icons";
import styles from "./PostForm.module.css";

const postUrl = "https://api.cloudinary.com/v1_1/duc4zmhl7/image/upload";
const resUrl = "https://res.cloudinary.com/duc4zmhl7/image/upload";

export default function PostForm({
  user,
  dispatchUser,
  addPost,
  postId,
  isComment,
  parentPostId,
  replyTo,
  replyHandler,
  className,
}) {
  const [isPostable, setIsPostable] = useState(false);
  const [numCharsTyped, setNumCharsTyped] = useState(0);
  const [progressBarVariant, setProgressBarVariant] = useState("success");
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const wordLimit = 250;

  // Every time the number of characters the user has typed in changes,
  // 1. Check whether the post is postable
  // 2. Notify the user how many more characters can be typed by use of a progress bar.
  const validateTextarea = (num) => num > 0 && num <= wordLimit;
  useEffect(() => {
    // Disable/enable the post button

    let validateTextareaTimeoutId = setTimeout(() => {
      setIsPostable(validateTextarea(numCharsTyped));
    }, 500);

    if (Math.floor((numCharsTyped / wordLimit) * 100) <= 70) {
      setProgressBarVariant("success");
    } else if (numCharsTyped <= wordLimit) {
      setProgressBarVariant("warning");
    } else {
      setProgressBarVariant("danger");
    }
    return () => {
      clearTimeout(validateTextareaTimeoutId);
    };
  }, [numCharsTyped]);

  // The useEffect above will be invoked when the handler below is called.
  const textareaChangeHandler = (event) => {
    setNumCharsTyped(event.target.value.length);
  };

  // Upload an image onto a page
  const imageUploadHandler = (event) => {
    let img = document.querySelector("#myImg");
    img.src = URL.createObjectURL(event.target.files[0]);
    setIsImageVisible(true);
  };

  // a non-async postHandler to show a loading sign
  const initialPostHandler = (e) => {
    e.preventDefault();
    setIsPosting(true);
    postHandler(e);
  };

  // Make a post request to Cloudinary to store it and access it using its API.
  const postHandler = async (e) => {
    let imagesToUpload = document.querySelector("#imageUpload").files;
    // Create a general post JSON
    let post = {
      postId: postId,
      parentId: null,
      children: [],
      text: e.target[0].value,
      datePosted: new Date(),
      postBy: user.data.email,
      likes: [],
      isDeleted: false,
      img: null,
    };
    if (isComment) {
      post.parentId = parentPostId;
    }

    // If user has attached an image in her post
    if (imagesToUpload.length !== 0) {
      const data = new FormData();
      data.append("file", imagesToUpload[0]);
      data.append("upload_preset", "zqlcfaas");

      fetch(postUrl, {
        method: "POST",
        body: data,
      })
        .then((response) => response.json())
        .then((data) => {
          post.img = `${resUrl}/v${data.version}/${data.public_id}.${data.format}`;

          e.target.querySelector("img").src = "#";
          addPost(post, isComment, parentPostId);
          setIsPosting(false);
        })
        .catch((error) => console.log(error));
    } else {
      addPost(post, isComment, parentPostId);
      setIsPosting(false);
    }

    e.target.reset();
    setIsPostable(false);
    setIsImageVisible(false);
    setNumCharsTyped(0);
    replyToRootPost();
  };

  // Reset the form's replyTo such that the user replies to the root post by default
  const replyToRootPost = () => {
    if (replyHandler !== null) {
      replyHandler(null, null);
    }
  };

  return (
    <>
      <Card className={className}>
        <Card.Body className={styles.cardBody}>
          <Row className="gx-0">
            <Col xs={3} className="d-flex-column">
              <Card.Img src={user.data.avatarsrc}></Card.Img>
              <ProgressBar
                className="my-3"
                variant={progressBarVariant}
                now={Math.floor((numCharsTyped / wordLimit) * 100)}
                label={
                  progressBarVariant !== "success" &&
                  `${wordLimit - numCharsTyped} letters left`
                }
              ></ProgressBar>
            </Col>
            <Col className={`${styles.textAreaCol}`}>
              {replyTo !== null ? (
                <Alert variant="primary" onClose={replyToRootPost} dismissible>
                  {replyTo}
                </Alert>
              ) : (
                <></>
              )}
              <Form onSubmit={initialPostHandler}>
                <Form.Control
                  autoFocus
                  as="textarea"
                  rows={6}
                  onChange={textareaChangeHandler}
                ></Form.Control>

                <img
                  id="myImg"
                  src="#"
                  className="img-fluid mt-3 rounded"
                  hidden={!isImageVisible}
                  alt="Uploaded"
                ></img>

                <Container className="d-flex justify-content-end align-items-center mt-3">
                  {!isComment && (
                    <Form.Group controlId="imageUpload">
                      <Form.Label className="mb-0">
                        <Image role="button" width="2em" height="2em"></Image>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        className="d-none"
                        onChange={imageUploadHandler}
                      ></Form.Control>
                    </Form.Group>
                  )}

                  <Button
                    type="submit"
                    disabled={!isPostable}
                    className={styles.formPostButton}
                  >
                    Post
                  </Button>
                </Container>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {isPosting ? (
        <Container className="d-flex justify-content-center my-3">
          <Spinner
            as="span"
            animation="grow"
            role="status"
            aria-hidden="true"
          />
        </Container>
      ) : (
        <div></div>
      )}
    </>
  );
}
