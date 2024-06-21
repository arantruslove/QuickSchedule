import { useState } from "react";
import {
  Card,
  Button,
  InputGroup,
  Form,
  ListGroup,
  Spinner,
  DropdownButton,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";

import TextInputModal from "../../../components/TextInputModal";

function PrivatePlan({
  isLoading,
  topicsData,
  newTopicTitle,
  newTopicHours,
  onNewTopicTitleChange,
  onNewTopicHoursClick,
  onSubmitClick,
  onEditTopicHours,
  onEditTopicTitle,
  onDeleteTopic,
}) {
  const [displayEditModal, setDisplayEditModal] = useState(false);
  const [modalId, setModalId] = useState(0);

  // Variables
  const hourOptions = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const maxItemsBeforeScroll = 5; // Set the number of items before scroll
  const itemHeight = 34; // Approximate height of each item
  const dropdownMaxHeight = maxItemsBeforeScroll * itemHeight;

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
          <Card.Title className="mb-3">Create Plan</Card.Title>
          <InputGroup className="mb-3">
            <InputGroup.Text>Topic Title</InputGroup.Text>
            <Form.Control
              placeholder="Enter topic title"
              value={newTopicTitle}
              onChange={(event) => onNewTopicTitleChange(event.target.value)}
            />
            <DropdownButton
              variant="outline-secondary"
              title={`${newTopicHours}h`}
              align="end"
            >
              <div style={{ maxHeight: dropdownMaxHeight, overflowY: "auto" }}>
                {hourOptions.map((hours, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => onNewTopicHoursClick(hours)}
                  >
                    {hours}
                  </Dropdown.Item>
                ))}
              </div>
            </DropdownButton>
            <Button variant="outline-secondary" onClick={onSubmitClick}>
              Submit
            </Button>
          </InputGroup>

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
                      <DropdownButton
                        variant="secondary"
                        as={ButtonGroup}
                        title={`${topic["hours"]}h`}
                        id="bg-nested-dropdown"
                        size="sm"
                        drop="start"
                      >
                        <div
                          style={{
                            maxHeight: dropdownMaxHeight,
                            overflowY: "auto",
                          }}
                        >
                          {hourOptions.map((hours, index) => (
                            <Dropdown.Item
                              key={index}
                              onClick={() =>
                                onEditTopicHours(hours, topic["id"])
                              }
                            >
                              {hours}
                            </Dropdown.Item>
                          ))}
                        </div>
                      </DropdownButton>
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
