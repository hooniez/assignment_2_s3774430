import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Signin from "./Signin";
import App from "../../App";
import Profile from "../profile/Profile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { mockUsers } from "../../data/repository";

let users;
let container;
let signinLink;
let emailInput;
let passwordInput;
let signinSubmitButton;

beforeAll(() => {
  users = mockUsers;
});

// Since it is important to let the user know the outcome of a sign-in through an appropriate message, three scenarios below are tested (1. the user successfully logs in 2. the user types in an incorrect password 3. the deleted user tries to log-in).
beforeEach(() => {
  const utils = render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/signin" element={<Signin />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
  container = utils.container;
  signinLink = screen.getByRole("link", { name: "Sign in" });
  // Render the signup form in screen by clicking the Sign up link
  fireEvent.click(signinLink);
  emailInput = screen.getByLabelText("Email");
  passwordInput = screen.getByLabelText("Password");
  signinSubmitButton = screen.getByRole("button", { name: "Sign In" });
});

afterEach(() => {
  cleanup();
});

// Tests whether a successful sign-in will take the user to the profile page that displays a welcome message.
test("Display a welcome message when the user is successfully verified", async () => {
  // Type in an existing user's email and password
  fireEvent.change(emailInput, { target: { value: users[0].email } });
  fireEvent.change(passwordInput, { target: { value: users[0].passwordHash } });
  await act(async () => {
    fireEvent.click(signinSubmitButton);
  });

  expect(screen.queryByText("Welcome, Myeonghoon!")).toBeInTheDocument();
});

// Tests whether an error message shows when the user has typed an incorrect password
test("Display an error message when the user types in an incorrect password", async () => {
  // Type in an existing user's email and password
  fireEvent.change(emailInput, { target: { value: users[0].email } });
  fireEvent.change(passwordInput, { target: { value: "incorrectPassword" } });
  await act(async () => {
    fireEvent.click(signinSubmitButton);
  });

  expect(screen.queryByText("Incorrect email or password")).toBeInTheDocument();
});

// Tests whether an error message shows when the user tries to log in with a deleted account (the user's account is never deleted, but its isDeleted property is set to true).
test("Display an error message when the user tries to log in with a deleted account", async () => {
  // Type in a deleted user's email and password
  fireEvent.change(emailInput, { target: { value: users[1].email } });
  fireEvent.change(passwordInput, { target: { value: users[1].passwordHash } });
  await act(async () => {
    fireEvent.click(signinSubmitButton);
  });

  expect(screen.queryByText("No such user exists")).toBeInTheDocument();
});
