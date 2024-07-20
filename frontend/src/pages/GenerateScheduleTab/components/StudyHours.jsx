import {
  Card,
  ListGroup,
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Pagination,
  Button,
} from "react-bootstrap";

import { formatDate, getDay, splitByWeek } from "../utils";

// Determining when the dropdown should start scrolling
const HOUR_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MAX_ITEMS_BEFORE_SCROLL = 5; // Set the number of items before scroll
const ITEM_HEIGHT = 34; // Approximate height of each item
const dropdownMaxHeight = MAX_ITEMS_BEFORE_SCROLL * ITEM_HEIGHT;

function StudyHours({
  datesHours,
  weekNumber,
  onWeekNumberDecrement,
  onWeekNumberIncrement,
  onHoursClick,
  onZeroAllHours,
}) {
  const weekByWeekData = splitByWeek(datesHours);
  const currentWeekData = weekByWeekData[weekNumber];

  return (
    <Card.Body
      style={{ display: "flex", flexDirection: "column", height: "80%" }}
    >
      <Card.Title className="mb-3 d-flex justify-content-between align-items-center">
        <div>Specify the Number of Hours to Study on Each Day</div>
        <Pagination className="mb-0">
          <Pagination.Prev
            disabled={weekNumber === 0}
            onClick={onWeekNumberDecrement}
          >
            &lt; Previous Week
          </Pagination.Prev>
          <Pagination.Next
            disabled={weekNumber === weekByWeekData.length - 2}
            onClick={onWeekNumberIncrement}
          >
            Next Week &gt;
          </Pagination.Next>
        </Pagination>
      </Card.Title>
      <div style={{ overflowY: "auto", flexGrow: 1 }}>
        <ListGroup>
          {currentWeekData.map((dateObj, index) => (
            <ListGroup.Item
              key={index}
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto fw-bold">
                {formatDate(dateObj["date"])} - {getDay(dateObj["date"])}
              </div>

              <DropdownButton
                variant="outline-secondary"
                as={ButtonGroup}
                title={`${dateObj["hours"]}h`}
                id={`dropdown-${dateObj.day}`}
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
                      onClick={() => onHoursClick(hours, dateObj["id"])}
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
        <Button variant="secondary" onClick={onZeroAllHours}>
          Zero All Hours
        </Button>
      </div>
    </Card.Body>
  );
}

export default StudyHours;
