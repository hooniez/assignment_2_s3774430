import { useState, useEffect, useRef } from "react";
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
  Toast,
  ToastContainer,
  Offcanvas,
} from "react-bootstrap";
import { FileEarmarkXFill, Image as ImageIcon, X } from "react-bootstrap-icons";
import Image from "react-bootstrap/Image";
import styles from "./PostForm.module.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createPost, updatePost } from "../../data/repository";

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
  isEditing,
  post,
  editImageChangeHandler,
  editPost,
  editModalToggler,
  postImgSrc,
}) {
  const [isPostable, setIsPostable] = useState(false);
  const [numCharsTyped, setNumCharsTyped] = useState(
    post !== null ? getNumLetters(post.text) : 0
  );
  const [progressBarVariant, setProgressBarVariant] = useState("success");
  const [isImageCanvasVisible, setIsImageCanvasVisible] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [text, setText] = useState(post === null ? "" : post.text);
  const [imgSrc, setImgSrc] = useState(post === null ? "" : postImgSrc);
  const [showImageError, setShowImageError] = useState(false);
  const imageUploaderRef = useRef(null);
  const imageUploaderControlId = `imageUpload${post !== null ? post.id : ""}`;

  const wordLimit = 600;

  let progressBar = document.querySelector(".progress-bar");

  // Every time the number of characters the user has typed in changes,
  // 1. Check whether the post is postable
  // 2. Notify the user how many more characters can be typed by use of a progress bar.
  const validateTextarea = (num) => num > 0 && num <= wordLimit;

  useEffect(() => {
    // Disable/enable the post button

    let validateTextareaTimeoutId = setTimeout(() => {
      setIsPostable(validateTextarea(numCharsTyped));
    });

    if (Math.floor((numCharsTyped / wordLimit) * 100) <= 70) {
      setProgressBarVariant("success");
    } else if (numCharsTyped <= wordLimit) {
      setProgressBarVariant("warning");
      if (!progressBar.classList.contains("text-dark")) {
        progressBar.classList.add("text-dark");
      }
    } else {
      setProgressBarVariant("danger");
      if (progressBar.classList.contains("text-dark")) {
        progressBar.classList.remove("text-dark");
      }
    }
    return () => {
      clearTimeout(validateTextareaTimeoutId);
    };
  }, [numCharsTyped]);

  // Get the number of actual letters without formatting characters
  function getNumLetters(formattedText) {
    return formattedText.replace(/<(.|\n)*?>/g, "").trim().length;
  }

  // The useEffect above will be invoked when the handler below is called.
  const textChangeHandler = (content) => {
    // console.log(`hey ${event}`);
    setText(content);
    // console.log(text);

    setNumCharsTyped(getNumLetters(content));
  };

  const canvasCloseHandler = () => {
    setIsImageCanvasVisible(false);
  };

  const canvasOpenHandler = () => {
    setIsImageCanvasVisible(true);
  };

  const canvasImageRemoveHandler = () => {
    setIsImageCanvasVisible(false);
    setImgSrc("");
  };

  // Upload an image onto a page
  const imageUploadHandler = (event) => {
    if (event.target.files.length > 0) {
      let blobs = [];
      Array.from(event.target.files).forEach((file) => {
        blobs.push(URL.createObjectURL(file));
      });
      setImgSrc(blobs[0]);
      if (isEditing) {
        editImageChangeHandler(blobs[0]);
      } else {
        setIsImageCanvasVisible(true);
      }
    }
  };

  // a non-async postHandler to show a loading sign
  const initialPostHandler = (e) => {
    e.preventDefault();
    setIsPosting(true);
    postHandler(e);
  };

  // Make a post request to Cloudinary to store it and access it using its API.
  const postHandler = async (e) => {
    const imagesToUpload = document.querySelector(
      `#${imageUploaderControlId}`
    ).files;
    // Create a general JSON object containing information about post
    console.log(e);
    let newPost;
    if (isEditing) {
      newPost = {
        ...post,
        text: text,
      };
    } else {
      newPost = {
        postedBy: user.data.email,
        parentId: null,
        text: text,
      };
    }

    if (isComment) {
      newPost.parentId = parentPostId;
    }

    // If user has just attached an image in her post
    if (imagesToUpload.length !== 0) {
      const data = new FormData();
      data.append("file", imagesToUpload[0]);
      data.append("upload_preset", "zqlcfaas");

      fetch(postUrl, {
        method: "POST",
        body: data,
      })
        .then((response) => response.json())
        .then(async (data) => {
          newPost.imgSrc = `${resUrl}/v${data.version}/${data.public_id}.${data.format}`;
          if (isEditing) {
            editPost(newPost.id, await updatePost(newPost));
          } else {
            addPost(await createPost(newPost), isComment, parentPostId);
          }
          setIsPosting(false);
          editModalToggler();
        })
        .catch((error) => console.log(error));
    } else {
      // If user hasn't just attached an image in her post
      if (isEditing) {
        // If user has deleted the image
        if (!postImgSrc) {
          newPost.imgSrc = null;
        }
        editPost(newPost.id, await updatePost(newPost));
      } else {
        addPost(await createPost(newPost), isComment, parentPostId);
      }
      setIsPosting(false);
      editModalToggler();
    }

    if (!isEditing) {
      // Clear the contents of ReactQuill
      document.querySelector(".ql-editor").innerHTML = "";
      setText("");
      setImgSrc("");
      setIsPostable(false);
      // setIsImageVisible(false);
      setNumCharsTyped(0);
      replyToRootPost();
    }
  };

  // Reset the form's replyTo such that the user replies to the root post by default
  const replyToRootPost = () => {
    if (replyHandler !== null) {
      replyHandler(null, null);
    }
  };

  return (
    <>
      <Card className={`${className}`}>
        <Card.Body className={styles.cardBody}>
          <Row className="gx-0">
            <Col xs={2} className="d-flex-column">
              <div className="d-flex justify-content-center">
                <Card.Img
                  src={user.data.avatarSrc}
                  className={styles.cardImg}
                ></Card.Img>
              </div>

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
            <Col xs={10} className={`${styles.textAreaCol}`}>
              {replyTo !== null ? (
                <Alert variant="primary" onClose={replyToRootPost} dismissible>
                  {replyTo}
                </Alert>
              ) : (
                <></>
              )}
              <Form onSubmit={initialPostHandler}>
                <ReactQuill
                  theme="snow"
                  text={text}
                  onChange={textChangeHandler}
                  defaultValue={text}
                ></ReactQuill>

                <div className="d-flex justify-content-end align-items-center mt-3">
                  <Toast
                    onClose={() => setShowImageError(false)}
                    show={showImageError}
                    delay={3000}
                    autohide
                  >
                    <Toast.Body className="text-danger">
                      You can only upload 4 images at most.
                    </Toast.Body>
                  </Toast>

                  <Offcanvas
                    show={isImageCanvasVisible}
                    onHide={canvasCloseHandler}
                    placement="bottom"
                    className={`${styles.canvas}`}
                  >
                    <Offcanvas.Header closeButton>
                      <Offcanvas.Title>Preview</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className="pt-0 d-flex justify-content-center">
                      <div className={`${styles.canvasImageContainers}`}>
                        <X
                          className={styles.x}
                          size={36}
                          role="button"
                          onClick={canvasImageRemoveHandler}
                        ></X>
                        <Image
                          src={imgSrc}
                          className={styles.canvasImages}
                          fluid={true}
                        />
                      </div>
                    </Offcanvas.Body>
                  </Offcanvas>
                  {!isEditing && imgSrc && (
                    <div
                      className={styles.uploadedImageContainer}
                      onClick={canvasOpenHandler}
                      position="relative"
                    >
                      <Image
                        src={imgSrc}
                        className={styles.uploadedImage}
                        role="button"
                      ></Image>
                    </div>
                  )}

                  {!isComment && (
                    <Form.Group controlId={imageUploaderControlId}>
                      <Form.Label className="mb-0">
                        <ImageIcon
                          role="button"
                          width="2em"
                          height="2em"
                        ></ImageIcon>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        className="d-none"
                        ref={imageUploaderRef}
                        onChange={imageUploadHandler}
                      ></Form.Control>
                    </Form.Group>
                  )}

                  <Button
                    type="submit"
                    disabled={!isPostable}
                    className={styles.formPostButton}
                  >
                    {isEditing ? "Edit" : "Post"}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {isPosting && (
        <Container className="d-flex justify-content-center my-3">
          <Spinner
            as="span"
            animation="grow"
            role="status"
            aria-hidden="true"
          />
        </Container>
      )}
    </>
  );
}
