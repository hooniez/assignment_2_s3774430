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
import PostsPage from "./PostsPage";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { mockUsers, mockPostToAdd } from "../../data/repository";

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
let post;
let postFromTextField;
let postButton;
let pencilIcon;
let editButton;

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
          <Route path="/profiles/:email" element={<Profile />} />
          <Route path="/posts" element={<PostsPage />} />
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

  postFromTextField = container.querySelector("[contenteditable='true']");
});

afterEach(() => {
  cleanup();
});

// Test whether posts can be successfully added and edited on the posts page
test("Correctly display a new post when it is added via the PostForm component and an updated post when an existing post is edited via the EditModal", async () => {
  // Type in text
  await act(async () => {
    postFromTextField.innerHTML = mockPostToAdd.text;
  });

  // Click Post
  postButton = screen.getByRole("button", { name: "Post" });
  await act(async () => {
    fireEvent.click(postButton);
  });

  // Check whether the post has been added to the posts page
  expect(screen.queryByText("Hey everyone")).toBeInTheDocument();

  // Next, check whether a certain post is already visible on the posts page
  expect(
    screen.queryByText("Hello, is anyone on the forum?")
  ).toBeInTheDocument();

  // Click the pencil icon to start editing
  pencilIcon = screen.getByTitle("pencil1");
  fireEvent.click(pencilIcon);

  // Verify there are no such text as below on the document now
  expect(screen.queryAllByText("HEY ANYBODY HERE???").length).toBe(0);
  // Change the post's text to what's above (because there are two instances of PostForm currently, use querySelectorAll)
  container
    .querySelectorAll("[contenteditable='true']")
    .forEach((el) => (el.innerHTML = "<p>HEY ANYBODY HERE???</p>"));

  // Click the Edit button to save
  editButton = screen.getByRole("button", { name: "Edit" });
  await act(async () => {
    fireEvent.click(editButton);
  });

  // Check whether the text has been correctly updated (the length is supposed to be 2 as this post is featured in the comments page as well).
  expect(screen.queryAllByText("HEY ANYBODY HERE???").length).toBe(2);
});
