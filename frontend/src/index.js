import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/authentication/Signup";
import Hero from "./pages/hero/Hero";
import Profile from "./pages/profile/Profile";
import SignInForm from "./pages/authentication/Signin";
import Posts from "./pages/forum/Posts";
import SignUpMFA from "./pages/authentication/MFA";
import Comments from "./pages/forum/Comments";
import { propTypes } from "react-bootstrap/esm/Image";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Hero />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profiles/:email" element={<Profile />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/posts" element={<Posts key={0} />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
