import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center">
      <Row>
        <Col className="text-center">
          <h1 className="display-1 fw-bold">404</h1>
          <p className="fs-3">
            <span className="text-danger">Oops!</span> The page you&apos;re
            looking for isn&apos;t here.
          </p>
          <p className="lead">
            You might have the wrong address, or the page may have moved.
          </p>
          <Link to="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default PageNotFound;
