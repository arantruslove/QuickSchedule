import React from "react";
import { Card, Button, InputGroup, Form, ListGroup } from "react-bootstrap";

function CreatePlan({ planTitle, onInputChange, onSubmitClick }) {
  return (
    <Card style={{ height: "80vh" }}>
      <Card.Body
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Card.Title className="mb-3">Create Plan</Card.Title>
        <InputGroup className="mb-3">
          <InputGroup.Text>Plan Title</InputGroup.Text>
          <Form.Control
            placeholder="Enter plan title"
            value={planTitle}
            onChange={(event) => onInputChange(event.target.value)}
          />
          <Button
            onClick={onSubmitClick}
            variant="outline-secondary"
            disabled={false}
          >
            Submit
          </Button>
        </InputGroup>
        <div style={{ overflowY: "auto", flexGrow: 1 }}>
          <ListGroup as="ol">
            {[...Array(5).keys()].map((index) => (
              <ListGroup.Item
                key={index}
                as="li"
                className="d-flex justify-content-between align-items-start"
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">Subheading</div>
                  id: 1
                </div>
                <Button
                  bg="primary"
                  size="sm"
                  pill
                  onClick={() => console.log("Badge has been clicked!")}
                >
                  Edit Title
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CreatePlan;
