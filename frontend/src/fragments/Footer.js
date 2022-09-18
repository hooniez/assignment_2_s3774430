import Container from "react-bootstrap/esm/Container";
import logo from "../logo.png";
import Navbar from "react-bootstrap/Navbar";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer>
      <Navbar className={styles.navbar} bg="light">
        <Container className="d-flex justify-content-center flex-column">
          <Navbar.Brand href="#home" className="text-center">
            <img src={logo} width="100" height="40" />
          </Navbar.Brand>
          <span>Copyleft &copy; {new Date().getFullYear()}</span>
        </Container>
      </Navbar>
    </footer>
  );
}
