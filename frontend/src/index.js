import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpForm from "./pages/SignUpForm";
import Hero from "./pages/hero/Hero";
import Profile from "./pages/profile/Profile";
import SignInForm from "./pages/SignInForm";
import Posts from "./pages/forum/Posts";
import SignUpMFA from "./fragments/MFA";

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
