import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import Logo from "../../../components/Logo";

function LandingPage() {
  return (
    <Container fluid className="min-vh-100 d-flex align-items-center bg-light">
      <Row className="justify-content-md-center">
        <Col md={8} className="text-center">
          <h1 className="display-6">
            <Logo />
          </h1>
          <p className="lead mt-4">
            QuickSchedule lets users create personalised revision schedules that
            are tailored to fit with their routine. Simply create Plans and
            Topics for each exam, specify how many hours you want to work on
            each day and let our algorithm handle the rest.
          </p>
          <div className="d-flex justify-content-center mt-4">
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
      </Row>
    </Container>
  );
}

export default LandingPage;
