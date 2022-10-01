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

// Tests whether the number of user ids that have given a heart raction each is correctly shown on the PostsPage. The mock API returns an array of two ids for the mockPost whose id is 1. See if that is correctly loaded on the PostPage. One of the returned ids is 1, which is the id of the user who logged in from beforeEach. Test the interactions by clicking the heart and thumbdown icons.
test("Correctly display the number of each reaction when it first loaded as well as when the user interacts with each reaction icon", async () => {
  let heartFillSpan = container.querySelector("[data-test-span='heartFill1']");
  // According to the return value of the mock API, there should be two hearts. Check that is the case.
  expect(heartFillSpan.textContent).toBe("2");

  // The number of thumbs-down should be 0. Check it is the case.
  let thumbDownSpan = container.querySelector("[data-test-span='thumbDown1']");
  expect(thumbDownSpan.textContent).toBe("0");

  // One of the two hearts is by the logged-in user himself. Click the heart button to see whether the count goes to 1 as expected.
  let heartButton = container.querySelector(
    "[data-test-button='heartButton1']"
  );

  await act(async () => {
    fireEvent.click(heartButton);
  });
  expect(heartFillSpan.textContent).toBe("1");
  expect(thumbDownSpan.textContent).toBe("0");

  // Click the heart button again to revert the count to 2 again.
  await act(async () => {
    fireEvent.click(heartButton);
  });
  expect(heartFillSpan.textContent).toBe("2");

  // Now, click the thumbDownButton to make the heart count go down to 1 while the thumbdown count to go up to 1.
  let thumbDownButton = container.querySelector(
    "[data-test-button='thumbDownButton1']"
  );

  await act(async () => {
    fireEvent.click(thumbDownButton);
  });

  let thumbDownFillSpan = container.querySelector(
    "[data-test-span='thumbDownFill1']"
  );
  expect(thumbDownFillSpan.textContent).toBe("1");
  let heartSpan = container.querySelector("[data-test-span='heart1']");
  expect(heartSpan.textContent).toBe("1");

  // Now, click the thumbDownButton to make the thumbdown count go down to 0 and back up to 1.
  await act(async () => {
    fireEvent.click(thumbDownButton);
  });

  expect(thumbDownSpan.textContent).toBe("0");
  await act(async () => {
    fireEvent.click(thumbDownButton);
  });
  expect(thumbDownFillSpan.textContent).toBe("1");

  // Finally, click the heart button to see that the heart count goes back to 2 and the thumbdown count goes down to 0.
  await act(async () => {
    fireEvent.click(heartButton);
  });
  expect(heartFillSpan.textContent).toBe("2");
  expect(thumbDownSpan.textContent).toBe("0");
});
