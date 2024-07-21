import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  ListGroup,
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Pagination,
  Button,
  Spinner,
} from "react-bootstrap";

// Determining when the dropdown should start scrolling
const HOUR_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const MAX_ITEMS_BEFORE_SCROLL = 5; // Set the number of items before scroll
const ITEM_HEIGHT = 34; // Approximate height of each item
const dropdownMaxHeight = MAX_ITEMS_BEFORE_SCROLL * ITEM_HEIGHT;

function TopicHours({
  plansData,
  onHoursClick,
  isGenerateScheduleActive,
  onGenerateScheduleClick,
}) {
  const [topicNumber, setTopicNumber] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate();

  const currentPlan = plansData[topicNumber];
  const currentTopics = currentPlan["topics"];
  currentTopics.sort((a, b) => a["id"] - b["id"]);

  const requiredHoursClass =
    currentPlan["required_hours"] === currentPlan["topic_hours"]
      ? "text-success"
      : "text-danger";

  return (
    <Card.Body
      style={{ display: "flex", flexDirection: "column", height: "80%" }}
    >
      <Card.Title className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          {currentPlan["title"]} -{" "}
          <span className={requiredHoursClass}>
            {currentPlan["topic_hours"]}/{currentPlan["required_hours"]}h
          </span>
        </div>
        <Pagination className="mb-0">
          <Pagination.Prev
            disabled={topicNumber === 0}
            onClick={() => setTopicNumber(topicNumber - 1)}
          >
            &lt; Previous Subject
          </Pagination.Prev>
          <Pagination.Next
            disabled={topicNumber === plansData.length - 1}
            onClick={() => {
              setTopicNumber(topicNumber + 1);
            }}
          >
            Next Subject &gt;
          </Pagination.Next>
        </Pagination>
      </Card.Title>
      <div style={{ overflowY: "auto", flexGrow: 1 }}>
        {currentTopics.length === 0 && (
          <Card.Text className="text-danger">
            * This Plan does not have any Topics.{" "}
            <span
              style={{
                textDecoration: "underline",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/create-plan/${currentPlan["id"]}`)}
            >
              Click here to add Topics.
            </span>
          </Card.Text>
        )}
        <ListGroup numbered="true">
          {currentTopics.map((topic, index) => (
            <ListGroup.Item
              key={index}
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto fw-bold">{topic["title"]}</div>

              <DropdownButton
                variant="outline-secondary"
                as={ButtonGroup}
                title={`${topic["hours"]}h`}
                id={index}
                size="sm"
                drop="start"
              >
                <div
                  style={{
                    maxHeight: dropdownMaxHeight,
                    overflowY: "auto",
                  }}
                >
                  {HOUR_OPTIONS.map((hours, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => onHoursClick(topic["id"], hours)}
                    >
                      {hours}
                    </Dropdown.Item>
                  ))}
                </div>
              </DropdownButton>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <div className="d-flex justify-content-start">
        {isGenerating ? (
          <Button variant="success" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            &nbsp;Generating...
          </Button>
        ) : (
          <Button
            variant="success"
            disabled={!isGenerateScheduleActive}
            onClick={() => {
              onGenerateScheduleClick();
              setIsGenerating(true);
            }}
          >
            Generate Schedule
          </Button>
        )}
      </div>
    </Card.Body>
  );
}

export default TopicHours;
