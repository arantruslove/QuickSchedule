import { useState, useEffect } from "react";
import { Card, Nav, Spinner } from "react-bootstrap";

import {
  createFormDraft,
  getFormDraft,
} from "../../../services/scheduleRequests";
import AllocateHoursContainer from "../containers/AllocateHoursContainer";
import SelectPlans from "./SelectPlans";
import ScheduleInformation from "./ScheduleInformation";
import MakeAdjustments from "./MakeAdjustments";

function GenerateSchedule() {
  const [isLoading, setIsLoading] = useState(true);
  const [tabNumber, setTabNumber] = useState(1);
  const [formDraftData, setFormDraftData] = useState(null);

  const updatePageData = async () => {
    let response = await getFormDraft();

    // Create a ScheduleFormDraft instance if it does not already exist
    if (response.status === 404) {
      response = await createFormDraft();
    }

    if (response.ok) {
      const data = await response.json();
      setFormDraftData(data);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    updatePageData();
  }, []);

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
            Schedule Information
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={4} onClick={() => setTabNumber(4)}>
            Make Adjustments
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {isLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {tabNumber === 1 && (
            <AllocateHoursContainer
              fetchedDatesToHours={formDraftData["daily_study_hours"]}
            />
          )}
          {tabNumber === 2 && <SelectPlans />}
          {tabNumber === 3 && <ScheduleInformation />}
          {tabNumber === 4 && <MakeAdjustments />}
        </>
      )}
    </Card>
  );
}

export default GenerateSchedule;
