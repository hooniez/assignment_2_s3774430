import logo from "../logo.png";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, NavLink } from "react-router-dom";
import styles from "./NavigationBar.module.css";
import { ToastContainer, Toast } from "react-bootstrap";
import { useEffect, useState } from "react";

export default function NavigationBar({ isLoggedIn, dispatchUser, user }) {
  const signOutUser = (event) => {
    dispatchUser({ type: "SIGNOUT_USER" });
  };

  const isLoggedOutJSX = (
    <Nav className="d-flex justify-content-end flex-grow-1">
      <NavLink to="/signup" className="nav-link">
        Sign up
      </NavLink>
      <NavLink to="/signin" className="nav-link">
        Sign in
      </NavLink>
    </Nav>
  );

  const isLoggedInJSX = (
    <Nav className="d-flex justify-content-between flex-grow-1">
      <div className="d-flex">
        <NavLink to="/profile" className="nav-link">
          Profile
        </NavLink>
        <NavLink to="/posts" className="nav-link">
          Posts
        </NavLink>
      </div>
      <div>
        <Link to="/" className="nav-link" onClick={signOutUser}>
          Sign Out
        </Link>
      </div>
    </Nav>
  );

  return (
    <Navbar className={styles.navbar} bg="light" expand="lg">
      <Container className="position-relative">
        <NavLink to="/" className="navbar-brand">
          <img src={logo} alt="logo" width="100" height="40" />
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isLoggedIn ? isLoggedInJSX : isLoggedOutJSX}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
