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
import ImageUploadPreview from "./ImageUploadPreview";

const postUrl = "https://api.cloudinary.com/v1_1/duc4zmhl7/image/upload";
const resUrl = "https://res.cloudinary.com/duc4zmhl7/image/upload";

export default function PostForm({
  user,
  addPost,
  addComment,
  postId,
  forComments,
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
  incrementNumChildPosts,
  replyModalToggelr,
  editParentPost,
}) {
  const [isPostable, setIsPostable] = useState(false);
  const [numCharsTyped, setNumCharsTyped] = useState(
    post !== null ? getNumLetters(post.text) : 0
  );
  const [progressBarVariant, setProgressBarVariant] = useState("success");
  const [isImageUploadPreviewVisible, setIsImageUploadPreviewVisible] =
    useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [text, setText] = useState(post === null ? "" : post.text);
  const [imgSrc, setImgSrc] = useState(post === null ? "" : postImgSrc);
  const [showImageError, setShowImageError] = useState(false);
  const imageUploaderRef = useRef(null);
  const imageUploaderControlId = `imageUpload${
    parentPostId !== null ? parentPostId : ""
  }`;

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

  const imageUploadPreviewToggler = () => {
    setIsImageUploadPreviewVisible(false);
  };

  const imageRemoveHandler = () => {
    setIsImageUploadPreviewVisible(false);
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
        setIsImageUploadPreviewVisible(true);
      }
    }
  };

  // a non-async postHandler to show a loading sign
  const initialPostHandler = (e) => {
    e.preventDefault();
    postHandler(e);
  };

  const resetPostForm = () => {
    document
      .querySelectorAll(".ql-editor")
      .forEach((el) => (el.innerHTML = ""));
    setText("");
    setImgSrc("");
    setIsPostable(false);
    setIsPosting(false);
    setNumCharsTyped(0);
    document.getElementById(imageUploaderControlId).value = "";
    if (forComments) {
      replyModalToggelr();
    }
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

    if (forComments) {
      newPost.parentId = parentPostId;
    }

    // If user has just attached an image in her post
    if (imagesToUpload.length !== 0) {
      setIsPosting(true);
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
            editModalToggler();
          } else {
            if (forComments) {
              await createPost(newPost);
              incrementNumChildPosts();
              resetPostForm();
            } else {
              addPost(await createPost(newPost), forComments, parentPostId);
              resetPostForm();
            }
          }
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
        editModalToggler();
      } else {
        if (forComments) {
          await createPost(newPost);
          incrementNumChildPosts();
        } else {
          // for Posts
          addPost(await createPost(newPost));
        }
      }
      resetPostForm();
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
      <div className="d-flex">
        <div className="d-flex-column">
          <div className="d-flex justify-content-center">
            <img src={user.data.avatarSrc} className={styles.cardImg} />
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
        </div>
        <div className={`${styles.textAreaCol} flex-grow-1`}>
          {replyTo !== null ? (
            <Alert variant="primary" onClose={replyToRootPost}>
              <strong>Replying to</strong> {replyTo}
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

              <ImageUploadPreview
                isImageUploadPreviewVisible={isImageUploadPreviewVisible}
                imageUploadPreviewToggler={imageUploadPreviewToggler}
                imageRemoveHandler={imageRemoveHandler}
                imgSrc={imgSrc}
              />

              {!isEditing && imgSrc && (
                <div
                  className={styles.uploadedImageContainer}
                  onClick={imageUploadPreviewToggler}
                  position="relative"
                >
                  <Image
                    src={imgSrc}
                    className={styles.uploadedImage}
                    role="button"
                  ></Image>
                </div>
              )}

              <Form.Group controlId={imageUploaderControlId}>
                <Form.Label className="mb-0">
                  <ImageIcon role="button" width="2em" height="2em"></ImageIcon>
                </Form.Label>
                <Form.Control
                  type="file"
                  className="d-none"
                  ref={imageUploaderRef}
                  onChange={imageUploadHandler}
                ></Form.Control>
              </Form.Group>

              <Button
                type="submit"
                disabled={!isPostable}
                className={styles.formPostButton}
              >
                {isEditing ? "Edit" : "Post"}
              </Button>
            </div>
          </Form>
        </div>
      </div>

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
