import {
  Card,
  ListGroup,
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Pagination,
} from "react-bootstrap";

import { addFormattedDateDay, splitByWeek } from "../dateFormat";

// Determining when the dropdown should start scrolling
const HOUR_OPTIONS = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MAX_ITEMS_BEFORE_SCROLL = 5; // Set the number of items before scroll
const ITEM_HEIGHT = 34; // Approximate height of each item
const dropdownMaxHeight = MAX_ITEMS_BEFORE_SCROLL * ITEM_HEIGHT;

function AllocateHours({
  datesToHours,
  weekNumber,
  onWeekNumberDecrement,
  onWeekNumberIncrement,
}) {
  console.log(datesToHours);
  // Obtaining the current week data
  const formattedDatesHoursDays = addFormattedDateDay(datesToHours);
  const weekByWeekData = splitByWeek(formattedDatesHoursDays);
  // console.log(weekByWeekData);
  const currentWeekData = weekByWeekData[weekNumber];

  return (
    <Card.Body
      style={{ display: "flex", flexDirection: "column", height: "80%" }}
    >
      <div className="d-flex justify-content-between align-items-center  fw-bold">
        Specify the number of hours to study on each day
        <Pagination>
          <Pagination.Prev
            disabled={weekNumber === 0}
            onClick={onWeekNumberDecrement}
          />
          <Pagination.Next
            disabled={weekNumber === weekByWeekData.length - 2}
            onClick={onWeekNumberIncrement}
          />
        </Pagination>
      </div>
      <div style={{ overflowY: "auto", flexGrow: 1 }}>
        <ListGroup>
          {currentWeekData.map((dateObj, index) => (
            <ListGroup.Item
              key={index}
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto fw-bold">
                {dateObj.formattedDate} ({dateObj.day})
              </div>

              <DropdownButton
                variant="outline-secondary"
                as={ButtonGroup}
                title={`${dateObj.hours}h`}
                id={`dropdown-${index}`}
                size="sm"
                drop="start"
              >
                <div
                  style={{
                    maxHeight: dropdownMaxHeight,
                    overflowY: "auto",
                  }}
                >
                  {HOUR_OPTIONS.map((hours, idx) => (
                    <Dropdown.Item key={idx}>{hours}</Dropdown.Item>
                  ))}
                </div>
              </DropdownButton>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </Card.Body>
  );
}

export default AllocateHours;
