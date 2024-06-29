import { useState } from "react";
import {
  Card,
  Button,
  InputGroup,
  Form,
  ListGroup,
  Spinner,
  ButtonGroup,
  Placeholder,
} from "react-bootstrap";

import TextInputModal from "../../../components/TextInputModal";

function PrivatePlan({
  isLoading,
  privatePlanTitle,
  topicsData,
  newTopicTitle,
  onNewTopicTitleChange,
  onSubmitClick,
  onEditTopicTitle,
  onDeleteTopic,
}) {
  const [displayEditModal, setDisplayEditModal] = useState(false);
  const [modalId, setModalId] = useState(0);

  return (
    <>
      {/* Text input modal */}
      <TextInputModal
        heading="Edit Topic Title"
        inputPlaceholder="Enter new topic title"
        show={displayEditModal}
        handleClose={() => setDisplayEditModal(false)}
        onSubmitClick={(title) => {
          onEditTopicTitle(title, modalId);
          setDisplayEditModal(false);
        }}
      />
      <Card style={{ height: "80vh" }}>
        <Card.Body
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {isLoading ? (
            <Card.Title className="mb-3">
              {" "}
              <Placeholder size="xs" />
            </Card.Title>
          ) : (
            <Card.Title className="mb-3">{privatePlanTitle}</Card.Title>
          )}

          <Form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmitClick();
            }}
          >
            <InputGroup className="mb-3">
              <InputGroup.Text>Topic Title</InputGroup.Text>
              <Form.Control
                placeholder="Enter topic title"
                value={newTopicTitle}
                onChange={(event) => onNewTopicTitleChange(event.target.value)}
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
              <ListGroup as="ol" numbered="true">
                {topicsData.map((topic) => (
                  <ListGroup.Item
                    key={topic["id"]}
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{topic["title"]}</div>
                    </div>
                    <ButtonGroup>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setDisplayEditModal(true);
                          setModalId(topic["id"]);
                        }}
                      >
                        Edit Title
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDeleteTopic(topic["id"])}
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

export default PrivatePlan;
