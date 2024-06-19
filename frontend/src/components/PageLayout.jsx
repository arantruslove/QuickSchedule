import React from "react";
import { Container, Row, Col, Navbar } from "react-bootstrap";
import Logo from "./Logo"; // Ensure the path is correct based on your directory structure

import MainNav from "./MainNav";

function PageLayout({ children }) {
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
        {/* Top Navbar for mobile */}
        <Navbar bg="light" expand="lg" className="d-md-none">
          <Container>
            <Navbar.Brand>
              <Logo />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <MainNav />
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Sidebar */}
        <Col
          xs={3}
          md={3}
          lg={2}
          className="sidebar d-none d-md-flex flex-column"
          style={sidebarStyle}
        >
          {/* Brand Area */}
          <Logo />
          <MainNav />
        </Col>

        {/* Main Content */}
        <Col xs={12} md={9} lg={10} className="content vh-100">
          {/* Top Section within Main Content */}
          <Row style={topbarStyle} className="d-none d-md-flex">
            <Col>
              <Logo />
            </Col>
          </Row>

          <Row className="p-4">
            <Col>{children}</Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default PageLayout;
