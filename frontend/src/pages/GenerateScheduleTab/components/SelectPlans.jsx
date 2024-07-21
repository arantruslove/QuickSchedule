import { Card, ListGroup, Form, Button } from "react-bootstrap";

function SelectPlans({ plansData, onCheckChange }) {
  // Ordering from highest to lowest id
  plansData.sort((a, b) => b["id"] - a["id"]);

  return (
    <Card.Body
      style={{ display: "flex", flexDirection: "column", height: "80%" }}
    >
      <Card.Title className="mb-3">
        Tick Check Boxes to Include Plans in the Schedule
      </Card.Title>
      <div style={{ overflowY: "auto", flexGrow: 1 }}>
        {plansData.length === 0 && (
          <Card.Text className="text-danger">
            * You currently do not have any plans. Please create a Plan.
          </Card.Text>
        )}
        <ListGroup as="ul">
          {plansData.map((plan) => (
            <ListGroup.Item
              key={plan["id"]}
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <Form.Check
                className="me-2"
                name="group1"
                style={{ transform: "scale(1.3)" }}
                isValid={true}
                checked={plan["is_selected"]}
                onChange={(event) => {
                  onCheckChange(plan["id"], event.target.checked);
                }}
              />
              <div className="ms-2 me-auto">
                <div className="fw-bold">{plan["title"]}</div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <div className="d-flex justify-content-start mt-4">
        <Button variant="success" className="me-2">
          Next Step
        </Button>
      </div>
    </Card.Body>
  );
}

export default SelectPlans;
