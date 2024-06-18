import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

import Logo from "../../../components/Logo";

function verifyEmailSuccess() {
  const navigate = useNavigate();
  return (
    <Container className="mt-3">
      <Row className="justify-content-center">
        <Col className="text-center">
          <h3>
            <Logo />
          </h3>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <Form className="mt-3">
                <Form.Group controlId="formPassword" className="mb-2">
                  <Form.Label>
                    Your email has been successfully verified!
                  </Form.Label>
                </Form.Group>

                <Button variant="primary" onClick={() => navigate("/login")}>
                  Login Page
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default verifyEmailSuccess;
