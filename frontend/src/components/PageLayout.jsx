import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";

function PageLayout() {
  const navbarStyle = {
    backgroundColor: "#F8FAFD",
    padding: "20px",
  };

  const brandStyle = {
    marginBottom: "30px",
    fontWeight: "bold",
    fontSize: "1.5em",
  };

  return (
    <Container fluid>
      <Row className="vh-100">
        {/* Sidebar */}
        <Col
          xs={12}
          md={3}
          lg={2}
          className="sidebar vh-100 d-flex flex-column"
          style={navbarStyle}
        >
          {/* Brand Area */}
          <div style={brandStyle}>My Brand</div>

          <Nav className="flex-column">
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
        <Col xs={12} md={9} lg={10} className="content vh-100">
          <h1>Main Content</h1>
          <p>This is the main content area.</p>
        </Col>
      </Row>
    </Container>
  );
}

export default PageLayout;
