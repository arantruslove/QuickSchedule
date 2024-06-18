import React from "react";
import { Container, Row, Col, Nav, Card, Form, Button } from "react-bootstrap";
import Logo from "./Logo"; // Ensure the path is correct based on your directory structure

function PageLayout() {
  const sidebarStyle = {
    backgroundColor: "#F8FAFD",
    padding: "20px",
    height: "100vh", // Ensure the sidebar spans the full height of the viewport
    borderRight: "1px solid #ddd",
  };

  const topbarStyle = {
    backgroundColor: "#F8FAFD",
    padding: "10px 20px",
    height: "60px",
    borderBottom: "1px solid #ddd",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  return (
    <Container fluid>
      <Row className="vh-100">
        {/* Sidebar */}
        <Col
          xs={3}
          md={3}
          lg={2}
          className="sidebar d-flex flex-column"
          style={sidebarStyle}
        >
          {/* Brand Area */}
          <Logo />

          <Nav className="flex-column" variant="pills">
            <Nav.Item>
              <Nav.Link href="#home" className="nav-link-custom">
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#link1" className="nav-link-custom">
                Link 1
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#link2" className="nav-link-custom">
                Link 2
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#disabled" className="nav-link-custom" disabled>
                Disabled
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col xs={9} md={9} lg={10} className="content vh-100">
          {/* Top Section within Main Content */}
          <Row style={topbarStyle}>
            <Col>
              <Logo />
            </Col>
          </Row>

          <Row className="p-4">
            <Col>
              <Card>
                <Card.Header as="h5">Form Title</Card.Header>
                <Card.Body>
                  <Card.Title>Main Content</Card.Title>
                  <Card.Text>
                    This is the main content area. It is styled using
                    Bootstrap's Card component for a cleaner look.
                  </Card.Text>

                  <Form>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword" className="mt-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="Password" />
                    </Form.Group>

                    <Form.Group controlId="formBasicCheckbox" className="mt-3">
                      <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="mt-3">
                      Submit
                    </Button>
                  </Form>
                </Card.Body>
                <Card.Footer className="text-muted">2 days ago</Card.Footer>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default PageLayout;
