import { Card, ListGroup, Form } from "react-bootstrap";

function SelectPlans({ plansData, onCheckChange }) {
  return (
    <Card.Body
      style={{ display: "flex", flexDirection: "column", height: "80%" }}
    >
      <Card.Title className="mb-3">
        Select Plans to Include in the Schedule
      </Card.Title>
      <div style={{ overflowY: "auto", flexGrow: 1 }}>
        <ListGroup as="ol" numbered="true">
          {plansData.map((plan) => (
            <ListGroup.Item
              key={plan["id"]}
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">{plan["title"]}</div>
                id: {plan["id"]}
              </div>
              <Form.Check
                reverse
                name="group1"
                checked={plan["is_selected"]}
                onChange={() => {
                  onCheckChange(plan["id"]);
                }}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </Card.Body>
  );
}

export default SelectPlans;
