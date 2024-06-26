import { useState } from "react";
import { Card, Nav } from "react-bootstrap";

import StudyHoursContainer from "../containers/StudyHoursContainer";
import SelectPlansContainer from "../containers/SelectPlansContainer";
import PlanDetailsContainer from "../containers/PlanDetailsContainer";
import TopicHoursContainer from "../containers/TopicHoursContainer";

function GenerateSchedule() {
  const [tabNumber, setTabNumber] = useState(1);
  const [isStudyHoursComplete, setIsStudyHoursComplete] = useState(false);
  const [isSelectPlansComplete, setIsSelectPlansComplete] = useState(false);
  const [isPlanDetailsComplete, setIsPlanDetailsComplete] = useState(false);

  return (
    <Card style={{ height: "80vh" }}>
      {/* Navbar */}
      <Nav variant="tabs" defaultActiveKey={tabNumber}>
        <Nav.Item>
          <Nav.Link
            eventKey={1}
            style={{ fontWeight: "bold" }}
            disabled={false}
            onClick={() => setTabNumber(1)}
          >
            Allocate Study Hours
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey={2}
            style={{ fontWeight: "bold" }}
            disabled={!isStudyHoursComplete}
            onClick={() => setTabNumber(2)}
          >
            Select Plans
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey={3}
            style={{ fontWeight: "bold" }}
            disabled={!(isStudyHoursComplete && isSelectPlansComplete)}
            onClick={() => setTabNumber(3)}
          >
            Plan Time Allocation
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey={4}
            style={{ fontWeight: "bold" }}
            disabled={
              !(
                isStudyHoursComplete &&
                isSelectPlansComplete &&
                isPlanDetailsComplete
              )
            }
            onClick={() => setTabNumber(4)}
          >
            Allocate Topic Hours
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {tabNumber === 1 && (
        <StudyHoursContainer
          onComplete={() => setIsStudyHoursComplete(true)}
          onIncomplete={() => {
            setIsStudyHoursComplete(false);
          }}
        />
      )}
      {tabNumber === 2 && (
        <SelectPlansContainer
          onComplete={() => setIsSelectPlansComplete(true)}
          onIncomplete={() => {
            setIsSelectPlansComplete(false);
          }}
        />
      )}
      {tabNumber === 3 && (
        <PlanDetailsContainer
          onComplete={() => setIsPlanDetailsComplete(true)}
          onIncomplete={() => setIsPlanDetailsComplete(false)}
        />
      )}
      {tabNumber === 4 && <TopicHoursContainer />}
    </Card>
  );
}

export default GenerateSchedule;
