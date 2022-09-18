import logo from "../logo.png";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, NavLink } from "react-router-dom";
import styles from "./NavigationBar.module.css";

export default function NavigationBar({ isLoggedIn, dispatchUser }) {
  const signOutUser = (event) => {
    dispatchUser({ type: "SIGNOUT_USER" });
  };

  const isLoggedOutJSX = (
    <>
      <NavLink to="/signup" className="nav-link">
        Sign Up
      </NavLink>
      <NavLink to="/signin" className="nav-link">
        Sign In
      </NavLink>
    </>
  );

  const isLoggedInJSX = (
    <>
      <NavLink to="/profile" className="nav-link">
        Profile
      </NavLink>
      <NavLink to="/posts" className="nav-link">
        Posts
      </NavLink>
      <Link to="/" className="nav-link" onClick={signOutUser}>
        Sign Out
      </Link>
    </>
  );

  return (
    <Navbar className={styles.navbar} bg="light" expand="lg">
      <Container>
        <NavLink to="/" className="navbar-brand">
          <img src={logo} alt="logo" width="100" height="40" />
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn ? isLoggedInJSX : isLoggedOutJSX}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
