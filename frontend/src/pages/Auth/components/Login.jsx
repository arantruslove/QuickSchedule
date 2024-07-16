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

function Login({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onLogin,
  isLoginIncorrect,
  isLoading,
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
      <Row className="justify-content-center  mt-3">
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
                    disabled={!isLoginActive}
                  >
                    Login
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
