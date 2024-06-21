import { useState } from "react";
import {
  Card,
  Button,
  InputGroup,
  Form,
  ListGroup,
  Spinner,
  ButtonGroup,
} from "react-bootstrap";

import TextInputModal from "../../../components/TextInputModal";

function CreatePlan({
  isLoading,
  planTitle,
  privatePlansData,
  onInputChange,
  onSubmitClick,
  onTabClick,
  onEditPlanTitle,
  onDeletePlan,
}) {
  const [displayEditModal, setDisplayEditModal] = useState(false);
  const [modalId, setModalId] = useState(0);

  return (
    <>
      <TextInputModal
        heading="Edit Plan Title"
        inputPlaceholder="Enter plan title"
        show={displayEditModal}
        handleClose={() => setDisplayEditModal(false)}
        onSubmitClick={(title) => {
          onEditPlanTitle(title, modalId);
          setDisplayEditModal(false);
        }}
      />
      <Card style={{ height: "80vh" }}>
        <Card.Body
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Card.Title className="mb-3">Create Plan</Card.Title>
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmitClick();
            }}
          >
            <InputGroup className="mb-3">
              <InputGroup.Text>Plan Title</InputGroup.Text>
              <Form.Control
                placeholder="Enter plan title"
                value={planTitle}
                onChange={(event) => onInputChange(event.target.value)}
              />
              <Button variant="outline-secondary" type="submit">
                Submit
              </Button>
            </InputGroup>
          </Form>

          {isLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "100vh" }}
            >
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <div style={{ overflowY: "auto", flexGrow: 1 }}>
              <ListGroup as="ol">
                {privatePlansData.map((privatePlan) => (
                  <ListGroup.Item
                    key={privatePlan["id"]}
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                    action="true"
                    style={{ cursor: "pointer" }}
                    onClick={() => onTabClick(privatePlan["id"])}
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{privatePlan["title"]}</div>
                      id: {privatePlan["id"]}
                    </div>
                    <ButtonGroup>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          setModalId(privatePlan["id"]);
                          setDisplayEditModal(true);
                        }}
                      >
                        Edit Title
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeletePlan(privatePlan["id"]);
                        }}
                      >
                        Delete
                      </Button>
                    </ButtonGroup>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default CreatePlan;
