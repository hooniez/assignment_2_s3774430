import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Signin from "../authentication/Signin";
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
let editButton;

beforeAll(() => {
  users = mockUsers;
});

// It is important to reflect change as soon as the user updates the profile. The test below checks whether the change of name is visible upon save.
beforeEach(async () => {
  const utils = render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/signin" element={<Signin />} />
          <Route path="/profiles/:email" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
  // First, log-in the user
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
  editButton = container.querySelector("[data-test-icon='pencil']");
});

afterEach(() => {
  cleanup();
});

// Tests whether the first name and last name are correctly updated upon pressing the save button.
test("Display the updated name when the user presses the save button", async () => {
  fireEvent.click(editButton);

  let firstNameInput = screen.getByLabelText("First Name");
  let lastNameInput = screen.getByLabelText("Last Name");

  // Make sure the names displayed before change are as expected
  expect(firstNameInput.value).toBe("Myeonghoon");
  expect(lastNameInput.value).toBe("Sun");

  // Change the first name and last name
  fireEvent.change(firstNameInput, { target: { value: "Hoonie" } });
  fireEvent.change(lastNameInput, { target: { value: "Moon" } });

  // Press the save button
  let saveButton = screen.getByRole("button", { name: "Save" });
  await act(async () => {
    fireEvent.click(saveButton);
  });

  // Check whether the updated name is visible, but the previous name is not.
  expect(screen.queryByText("Hoonie Moon")).toBeInTheDocument();
  expect(screen.queryByText("Myeonghoon Sun")).toBeNull();
});
