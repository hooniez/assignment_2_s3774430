import { Row, Col } from "react-bootstrap";
import Container from "react-bootstrap/esm/Container";
import styles from "./Hero.module.css";
import heroImage from "./hero.jpg";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <Container className="component">
      <h1 className="display-4">
        Social Media Platform
        <br />
        for Loop Agile
      </h1>
      <p className="lead">Built to enable communications within Loop Agile.</p>
      <hr className="my-5"></hr>
      <Row>
        <Col className="col-lg-6 d-flex align-items-center justify-content-center">
          <h2>
            <Link to="signup">Sign up</Link> and start sharing your ideas!
          </h2>
        </Col>
        <Col className="col-12 col-lg-6 d-flex justify-content-lg-end justify-content-center">
          <img
            className={`img-fluid ${styles.heroImg}`}
            src={heroImage}
            alt="Agile Office Background"
          ></img>
        </Col>
      </Row>
    </Container>
  );
}
