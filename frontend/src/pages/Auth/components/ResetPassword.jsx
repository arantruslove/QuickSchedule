import { useNavigate } from "react-router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

function ResetPassword({
  password,
  confirmPassword,
  isInputsValid,
  hasErrorOccurred,
  isResetSuccess,
  onPasswordChange,
  onConfirmPasswordChange,
  onButtonClick,
}) {
  const navigate = useNavigate();
  return (
    <Container
      className="align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="justify-content-center mb-3 mt-3">
        <Col className="text-center">
          <h1 className="display-5">App Name Placholder</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={14} sm={10} md={8} lg={6} className="mx-auto">
          <Card className="p-4 shadow">
            <Card.Body>
              {isResetSuccess ? (
                <>
                  <p>Your password has been reset!</p>
                  <Button onClick={() => navigate("/login")}>Login Page</Button>
                </>
              ) : (
                <Form
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault(); // Prevent the default form submission
                  }}
                >
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(event) => onPasswordChange(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="formPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(event) =>
                        onConfirmPasswordChange(event.target.value)
                      }
                    />
                  </Form.Group>

                  {hasErrorOccurred && (
                    <Form.Text className="text-danger">
                      *An error occurred.
                    </Form.Text>
                  )}
                  <Form.Group className="mb-3"></Form.Group>
                  <Button
                    variant="primary"
                    disabled={!isInputsValid}
                    onClick={onButtonClick}
                  >
                    Submit
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ResetPassword;
