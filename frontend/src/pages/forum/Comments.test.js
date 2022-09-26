import React from "react";
import {
  cleanup,
  fireEvent,
  getByText,
  render,
  screen,
} from "@testing-library/react";
import Signin from "../authentication/Signin";
import App from "../../App";
import Profile from "../profile/Profile";
import Posts from "./Posts";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { mockUsers } from "../../data/repository";
import { unmountComponentAtNode } from "react-dom";
import { JustifyLeft } from "react-bootstrap-icons";

let utils;
let users;
let container;
let signinLink;
let emailInput;
let passwordInput;
let signinSubmitButton;
let postsLink;
let commentsButton;
let numComments;
let trashButton;
let post;
let deleteButton;
let replyButton;

beforeAll(() => {
  users = mockUsers;
});

// Take the user to the posts page
beforeEach(async () => {
  utils = render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/signin" element={<Signin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts" element={<Posts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
  // First, log-in the user
  // console.log("BeforeAll");
  container = utils.container;
  signinLink = screen.getByRole("link", { name: "Sign in" });
  // Render the signup form in screen by clicking the Sign up link
  fireEvent.click(signinLink);
  emailInput = screen.getByLabelText("Email");
  passwordInput = screen.getByLabelText("Password");
  signinSubmitButton = screen.getByRole("button", { name: "Sign In" });
  fireEvent.change(emailInput, { target: { value: users[0].email } });
  fireEvent.change(passwordInput, { target: { value: users[0].passwordHash } });
  await act(async () => {
    fireEvent.click(signinSubmitButton);
  });
  // On Profile page
  postsLink = screen.getByRole("link", { name: "Posts" });
  await act(async () => {
    fireEvent.click(postsLink);
  });
  // assign post with the mock post outer most div
  post = container.querySelector("[data-test-post='1']");
  commentsButton = post.querySelector("[data-test-icon='chat1']");
  numComments = post.querySelector("[data-test-span='numComments1']");

  // First check the mocked post is in the document whereas mocked comments are not in the document.
  expect(
    screen.queryByText("Hello, is anyone on the forum?")
  ).toBeInTheDocument();
  expect(
    screen.queryByText("Please disregard this message. I was lonely")
  ).toBeNull();
  // Next, check whether the number of its comments is 2
  expect(numComments.textContent).toBe("2");

  // screen.debug(undefined, 300000);
});

afterEach(() => {
  cleanup();
});

// The posts page shows each root post and the number of comments it has.  Comments are displayed in a modal. In the modal, it is possible to delete comments. It is important to show the user that the comment has been successfully deleted by changing the number of comments in two areas, namely comments and posts.
test("Display the updated number of comments associated with a post when the user deletes a comment", async () => {
  // Open the comments modal
  await act(async () => {
    fireEvent.click(commentsButton);
  });
  // Now check again whether the same mocked comment is in the document.
  expect(
    screen.queryByText("Please disregard this message. I was lonely")
  ).toBeInTheDocument();
  // Click the trash icon of the comment to delete
  trashButton = screen.getByTitle("trash2");
  fireEvent.click(trashButton);

  // Check whether a delte modal has popped up
  expect(screen.queryByText("Delete Post")).toBeInTheDocument();

  // Click the Delete button
  deleteButton = screen.getByRole("button", { name: "Delete" });
  await act(async () => {
    fireEvent.click(deleteButton);
  });

  // Check whether the post still exists
  expect(
    screen.queryByText("Please disregard this message. I was lonely")
  ).toBeNull();

  // There are two areas in which the number of comments for the root post can be found. Check all these areas now have the value of 1 instead of 2 since a post has just been deleted.
  numComments = post.querySelectorAll("[data-test-span='numComments1']");
  numComments.forEach((el) => {
    expect(el.textContent).toBe("1");
  });
});
