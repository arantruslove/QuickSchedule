import React from "react";
import { Card, ListGroup, Form } from "react-bootstrap";

function PlanDetails({
  plansData,
  totalFraction,
  onPercentChange,
  onDateChange,
}) {
  // Sorting by id
  plansData.sort((a, b) => b["id"] - a["id"]);

  const totalFractionStyle = {
    color: totalFraction === 1 ? "green" : "red",
  };

  return (
    <Card.Body
      style={{ display: "flex", flexDirection: "column", height: "80%" }}
    >
      <Card.Title className="mb-3">
        Enter the Exam Dates and Percentage of Time to Spend on Each Plan
      </Card.Title>
      <div style={{ overflowY: "auto", flexGrow: 1 }}>
        <ListGroup as="ol" numbered>
          {plansData.map((plan) => (
            <ListGroup.Item
              key={plan["id"]}
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="fw-bold ms-2 me-auto">{plan["title"]}</div>
              <Form.Control
                type="text"
                placeholder="% Time allocation"
                className="me-2"
                style={{ width: "20%" }}
                value={
                  Number(plan["fraction"]) === 0
                    ? ""
                    : Math.round(100 * plan["fraction"])
                }
                onChange={(event) => {
                  onPercentChange(plan["id"], event.target.value);
                }}
              />
              <Form.Control
                type="date"
                className="me-2"
                style={{ width: "20%" }}
                value={plan["exam_date"]}
                onChange={(event) => {
                  onDateChange(plan["id"], event.target.value);
                }}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <Card.Text className="mt-4" style={totalFractionStyle}>
        Total: {Math.round(100 * totalFraction)}%
      </Card.Text>
    </Card.Body>
  );
}

export default PlanDetails;
