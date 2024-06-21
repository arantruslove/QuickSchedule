import {
  Card,
  Button,
  InputGroup,
  Form,
  ListGroup,
  Spinner,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";

function PrivatePlan({
  isLoading,
  topicsData,
  newTopicTitle,
  newTopicHours,
  onNewTopicTitleChange,
  onNewTopicHoursClick,
  onSubmitClick,
}) {
  // Variables
  const hourOptions = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const maxItemsBeforeScroll = 5; // Set the number of items before scroll
  const itemHeight = 34; // Approximate height of each item
  const dropdownMaxHeight = maxItemsBeforeScroll * itemHeight;

  return (
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
            title={`${newTopicHours} hours`}
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
                  onClick={() => console.log("Placeholder!")}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{topic["title"]}</div>
                  </div>
                  {/* <Button
                    bg="primary"
                    size="sm"
                    pill="true"
                    onClick={() => console.log("Badge has been clicked!")}
                  >
                    Edit Title
                  </Button> */}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default PrivatePlan;
