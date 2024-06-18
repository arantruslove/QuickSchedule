import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import Logo from "../../../components/Logo";

function InitiateReset({
  inputText,
  isEmailUnknown,
  isResetInitiated,
  onInputTextChange,
  onButtonClick,
}) {
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
              {isResetInitiated ? (
                <p>
                  We have sent you an email with the details required to reset
                  your password!
                </p>
              ) : (
                <Form noValidate>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email to reset password"
                      value={inputText}
                      onChange={(event) =>
                        onInputTextChange(event.target.value)
                      }
                    />

                    {isEmailUnknown && (
                      <Form.Text className="text-danger">
                        *No account found with this email.
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Button variant="primary" onClick={onButtonClick}>
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

export default InitiateReset;
