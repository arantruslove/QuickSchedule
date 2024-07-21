import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import Logo from "../../../components/Logo";

function LandingPage() {
  return (
    <Container fluid className="min-vh-100 bg-light">
      <Row style={{ height: "15vh" }} />
      <Row>
        <Col xs={2} />
        <Col xs={8}>
          <h1 className="display-5">
            <Logo />
          </h1>
          <div className="lead">
            <p>
              <strong>QuickSchedule</strong> helps you easily create
              personalized study schedules that seamlessly integrate with your
              routine.
            </p>
            <ol>
              <li>
                Add <strong>Subjects</strong> and <strong>Topics</strong> for
                each of your exams.
              </li>
              <li>
                Specify the <strong>number of hours</strong> you plan to work on
                each day and your <strong>exam dates</strong>.
              </li>
              <li>
                Let our unique algorithm create a{" "}
                <strong>personalized study schedule</strong> based on the
                information you provided.
              </li>
            </ol>
          </div>
          <div className="d-flex justify-content-center mt-5">
            <Link to="/login">
              <Button variant="primary" className="mx-2">
                Login
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button variant="success" className="mx-2">
                Sign Up
              </Button>
            </Link>
          </div>
        </Col>
        <Col xs={2} />
      </Row>
    </Container>
  );
}

export default LandingPage;
