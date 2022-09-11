import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpForm from "./UI/SignUpForm";
import Hero from "./UI/Hero/Hero";
import Profile from "./UI/Profile/Profile";
import SignInForm from "./UI/SignInForm";
import Posts from "./UI/Posts/Posts";
import SignUpMFA from "./UI/MFA";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Hero />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/posts" element={<Posts />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
