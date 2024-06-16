import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <Container fluid className="min-vh-100 d-flex align-items-center bg-light">
      <Row className="justify-content-md-center">
        <Col md={8} className="text-center">
          <h1 className="display-4 fw-bold">App Name Placeholder</h1>
          <p className="lead mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            nec neque ipsum. Phasellus hendrerit blandit diam, ut scelerisque
            elit egestas sed. Duis sollicitudin diam sit amet est auctor congue.
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
