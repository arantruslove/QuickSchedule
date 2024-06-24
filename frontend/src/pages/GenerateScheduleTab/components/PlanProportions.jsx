import React from "react";
import { Card, ListGroup, Form } from "react-bootstrap";

import { truncateISODate } from "../planProportionsUtils";

function PlanProportions({
  plansData,
  totalPercent,
  onPercentChange,
  onDateChange,
}) {
  const totalPercentStyle = {
    color: totalPercent === 100 ? "green" : "red",
  };

  return (
    <Card.Body
      style={{ display: "flex", flexDirection: "column", height: "80%" }}
    >
      <Card.Title className="mb-3">
        Enter the Percentage of Time to Spend and the Exam Date of Each Plan
      </Card.Title>
      <div style={{ overflowY: "auto", flexGrow: 1 }}>
        <ListGroup as="ol" numbered>
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
              <Form.Control
                type="text"
                placeholder="% Time allocation"
                className="me-2"
                style={{ width: "20%" }}
                value={plan["percent_allocated"]}
                onChange={(event) => {
                  onPercentChange(event.target.value, plan["id"]);
                }}
              />
              <Form.Control
                type="date"
                className="me-2"
                style={{ width: "20%" }}
                value={truncateISODate(plan["exam_date"])}
                onChange={(event) => {
                  onDateChange(event.target.value, plan["id"]);
                }}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <Card.Text className="mt-4" style={totalPercentStyle}>
        Total: {totalPercent}%
      </Card.Text>
    </Card.Body>
  );
}

export default PlanProportions;
