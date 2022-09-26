import "@testing-library/jest-dom";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import Signup from "./Signup";
import App from "../../App";

import { BrowserRouter, Routes, Route } from "react-router-dom";

let container;
let signupLink;
let firstNameInput;
let lastNameInput;
let emailInput;
let passwordInput;
let confirmInput;
let signupSubmitButton;

// Since it is important to store the passwords the user intended to use in the database, it is paramount that corresponding validations checks work as expected. Each unit test below tests all the validation logic related to the password after all the other fields are prepopulated in beforeEach()
beforeEach(() => {
  const utils = render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
  container = utils.container;
  signupLink = screen.getByRole("link", { name: "Sign up" });
  // Render the signup form in screen by clicking the Sign up link
  fireEvent.click(signupLink);
  firstNameInput = screen.getByLabelText("First name");
  lastNameInput = screen.getByLabelText("Last name");
  // Enter John Doe
  fireEvent.change(firstNameInput, { target: { value: "John" } });
  fireEvent.change(lastNameInput, { target: { value: "Doe" } });
  emailInput = screen.getByLabelText("Email");
  // Enter the email address
  fireEvent.change(emailInput, { target: { value: "johndoe@gmail.com" } });
  passwordInput = screen.getByLabelText("Password");
  confirmInput = screen.getByLabelText("Confirm Password");
  signupSubmitButton = screen.getByRole("button", { name: "Sign Up" });
});

afterEach(() => {
  cleanup();
});

// Tests whether the warning sign does not show when identical passwords are typed
test("Do not show 'Passwords are identical' when identical passwords are typed", () => {
  // Type in different passwords
  fireEvent.change(passwordInput, { target: { value: "abcDEF1!" } });
  fireEvent.change(confirmInput, { target: { value: "abcDEF1!" } });

  fireEvent.click(signupSubmitButton);
  
  expect(screen.queryByText("Passwords are not identical")).toBeNull();
});

// Tests whether the warning sign shows when different passwords are typed
test("Show 'Passwords are not identical' when different passwords are typed", () => {
  // Type in different passwords
  fireEvent.change(passwordInput, { target: { value: "abcDEF1!" } });
  fireEvent.change(confirmInput, { target: { value: "abcDEF1@" } });

  fireEvent.click(signupSubmitButton);

  expect(
    screen.queryByText("Passwords are not identical", { exact: false })
  ).toBeInTheDocument();
});

// Tests whether the warning sign shows when passwords entered are 7 characters or less (the same warning sign is displayed on render and therefore whether two of these signs are displayed is checked at the end)
test("Show 2 instacnes of 'Use 8 or more character with a mix of lowercase and uppercase letters, numbers & symbols' when passwords entered are 7 characters or less", () => {
  // Type in different passwords
  fireEvent.change(passwordInput, { target: { value: "abcDE1!" } });
  fireEvent.change(confirmInput, { target: { value: "abcDE1!" } });

  fireEvent.click(signupSubmitButton);

  expect(
    screen.queryAllByText(
      "Use 8 or more character with a mix of lowercase and uppercase letters, numbers & symbols",
      { exact: false }
    )
  ).toHaveLength(2);
});

