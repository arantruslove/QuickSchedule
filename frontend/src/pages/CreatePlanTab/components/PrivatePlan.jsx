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
  newTopicTitle,
  newTopicHours,
  onNewTopicTitleChange,
  onNewTopicHoursClick,
  onSubmitClick,
}) {
  const isLoading = false;
  const placeholderData = [{ id: 1, title: "Placeholder Title" }];
  const hourOptions = [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
            {hourOptions.map((hours, index) => {
              return (
                <Dropdown.Item
                  key={index}
                  onClick={() => onNewTopicHoursClick(hours)}
                >
                  {hours}
                </Dropdown.Item>
              );
            })}
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
              {placeholderData.map((privatePlan) => (
                <ListGroup.Item
                  key={privatePlan["id"]}
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                  onClick={() => console.log("Placeholder!")}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{privatePlan["title"]}</div>
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
