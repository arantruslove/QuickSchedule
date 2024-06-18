import React from "react";
import { Container, Row, Col, Nav, Card } from "react-bootstrap";

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

  const brandStyle = {
    marginBottom: "30px",
    fontWeight: "bold",
    fontSize: "1.5em",
    textAlign: "center",
    fontFamily: "'Montserrat', sans-serif",
  };

  const scheduleStyle = {
    color: "#007BFF", // Blue
  };

  const quickStyle = {
    color: "#28A745", // Green
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
          <div style={brandStyle}>
            <span style={quickStyle}>Quick</span>
            <span style={scheduleStyle}>Schedule</span>
          </div>

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
              <div style={brandStyle}>
                <span style={quickStyle}>Quick</span>
                <span style={scheduleStyle}>Schedule</span>
              </div>
            </Col>
          </Row>

          <Row className="p-4">
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Main Content</Card.Title>
                  <Card.Text>
                    This is the main content area. It is styled using
                    Bootstrap's Card component for a cleaner look.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default PageLayout;
