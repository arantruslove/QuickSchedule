import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

function verifyEmailSuccess() {
  const navigate = useNavigate();
  return (
    <Container className="mt-3">
      <Row className="justify-content-center mb-2">
        <Col className="text-center">
          <h1 className="display-5">App Name Placholder</h1>
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
