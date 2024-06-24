import { useState } from "react";
import { Card, Nav } from "react-bootstrap";

import AllocateHoursContainer from "../containers/AllocateHoursContainer";
import SelectPlansContainer from "../containers/SelectPlansContainer";
import PlanProportionsContainer from "../containers/PlanProportionsContainer";
import MakeAdjustments from "./MakeAdjustments";

function GenerateSchedule() {
  const [tabNumber, setTabNumber] = useState(1);

  return (
    <Card style={{ height: "80vh" }}>
      {/* Navbar */}
      <Nav variant="tabs" defaultActiveKey={tabNumber}>
        <Nav.Item>
          <Nav.Link eventKey={1} onClick={() => setTabNumber(1)}>
            Allocate Study Hours
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={2} onClick={() => setTabNumber(2)}>
            Select Plans
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={3} onClick={() => setTabNumber(3)}>
            Plan Time Allocation
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={4} onClick={() => setTabNumber(4)}>
            Make Adjustments
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {tabNumber === 1 && <AllocateHoursContainer />}
      {tabNumber === 2 && <SelectPlansContainer />}
      {tabNumber === 3 && <PlanProportionsContainer />}
      {tabNumber === 4 && <MakeAdjustments />}
    </Card>
  );
}

export default GenerateSchedule;
