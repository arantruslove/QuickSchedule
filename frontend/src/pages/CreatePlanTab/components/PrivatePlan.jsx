import {
  Card,
  Button,
  InputGroup,
  Form,
  ListGroup,
  Spinner,
} from "react-bootstrap";

function PrivatePlan() {
  const isLoading = false;
  const placeholderData = [{ id: 1, title: "Placeholder Title" }];

  return (
    <Card style={{ height: "80vh" }}>
      <Card.Body
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Card.Title className="mb-3">Create Plan</Card.Title>
        <InputGroup className="mb-3">
          <InputGroup.Text>Plan Title</InputGroup.Text>
          <Form.Control placeholder="Enter plan title" value={"Placeholder"} />
          <Button variant="outline-secondary" disabled={false}>
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
            <ListGroup as="ol">
              {placeholderData.map((privatePlan) => (
                <ListGroup.Item
                  key={privatePlan["id"]}
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                  action="true"
                  style={{ cursor: "pointer" }}
                  onClick={() => console.log("Placeholder!")}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{privatePlan["title"]}</div>
                    id: {privatePlan["id"]}
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
