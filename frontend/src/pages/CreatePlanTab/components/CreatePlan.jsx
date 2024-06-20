import React from "react";
import {
  Card,
  Button,
  InputGroup,
  Form,
  ListGroup,
  Badge,
} from "react-bootstrap";

function CreatePlan() {
  return (
    <Card style={{ height: "80vh" }}>
      <Card.Body
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Card.Title className="mb-3">Create Plan</Card.Title>
        <InputGroup className="mb-3">
          <InputGroup.Text>Plan Title</InputGroup.Text>
          <Form.Control placeholder="Recipient's username" />
          <Button variant="outline-secondary" id="button-addon2">
            Button
          </Button>
        </InputGroup>
        <div style={{ overflowY: "auto", flexGrow: 1 }}>
          <ListGroup as="ol" numbered>
            {[...Array(5).keys()].map((index) => (
              <ListGroup.Item
                key={index}
                as="li"
                className="d-flex justify-content-between align-items-start"
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">Subheading</div>
                  Cras justo odio
                </div>
                <Badge bg="primary" pill>
                  14
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CreatePlan;
