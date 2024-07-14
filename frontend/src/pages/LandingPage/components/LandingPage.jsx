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
              <strong>QuickSchedule</strong> helps you create personalized
              revision schedules that seamlessly integrate with your routine,
              ensuring efficient and balanced study plans.
            </p>
            <ul>
              <li>
                Create <strong>Plans</strong> and add <strong>Topics</strong>{" "}
                for each of your exams.
              </li>
              <li>
                Specify the <strong>number of hours</strong> you aim to work on
                each day and your <strong>exam dates</strong>.
              </li>
              <li>
                Let our <strong>unique algorithm</strong> create a personalised
                schedule based on the information you provided.
              </li>
            </ul>
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
