import { useState } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
  Nav,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import Logo from "../../../components/Logo";

function SignUp({
  email,
  password,
  confirmPassword,
  isEmailTaken,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  isSubmittable,
  onSignUp,
  signUpFailed,
  signUpSuccess,
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Container
      className="align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="justify-content-center mt-3">
        <Col className="text-center">
          <h3>
            <Logo />
          </h3>
        </Col>
      </Row>
      <Row>
        <Col xs={14} sm={10} md={8} lg={6} className="mx-auto">
          <Card className="p-4 shadow">
            <Card.Body>
              <Nav variant="tabs" defaultActiveKey="sign-up" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="login" as={Link} to="/login">
                    Login
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="sign-up" as={Link} to="/sign-up">
                    Sign Up
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              {signUpSuccess ? (
                <p>
                  Thank you for signing up! We&apos;ve just dispatched a
                  verification email to your inbox. Please check your email and
                  follow the instructions to complete your registration.
                </p>
              ) : (
                <Form
                  onSubmit={(event) => {
                    event.preventDefault(); // Prevent the default form submission
                    setIsLoading(true);
                    onSignUp();
                  }}
                >
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(event) => onEmailChange(event.target.value)}
                    />
                    {isEmailTaken && (
                      <Form.Text className="text-danger">
                        *Email already registered.
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter a password"
                      value={password}
                      onChange={(event) => onPasswordChange(event.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(event) =>
                        onConfirmPasswordChange(event.target.value)
                      }
                    />
                    {signUpFailed && (
                      <Form.Text className="text-danger">
                        *There was an error registering your account.
                      </Form.Text>
                    )}
                  </Form.Group>

                  {isLoading ? (
                    <Button variant="primary" disabled>
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={!isSubmittable}
                    >
                      Sign Up
                    </Button>
                  )}
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;
