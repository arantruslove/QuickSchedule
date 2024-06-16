import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

function Login({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onLogin,
  isLoginIncorrect,
}) {
  let isLoginActive = false;

  if (email.length > 0 && password.length > 0) {
    isLoginActive = true;
  }

  return (
    <Container
      className="align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="justify-content-center mb-3 mt-3">
        <Col className="text-center">
          <h1 className="display-5">App Name Placeholder</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={14} sm={10} md={8} lg={6} className="mx-auto">
          <Card className="p-4 shadow">
            <Card.Body>
              <Nav variant="tabs" defaultActiveKey="login" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="login" as={Link} to="/login">
                    Login
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/sign-up">
                    Sign Up
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Form
                noValidate
                onSubmit={(event) => {
                  event.preventDefault(); // Prevent the default form submission
                  onLogin();
                }}
              >
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(event) => {
                      onEmailChange(event.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-2" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(event) => {
                      onPasswordChange(event.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  {isLoginIncorrect && (
                    <Form.Text className="text-danger">
                      *Email or password is incorrect.
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Link to="/initiate-password-reset">Forgot Password?</Link>
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!isLoginActive}
                >
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
