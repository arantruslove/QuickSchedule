import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import { getScheduleTopics } from "../../../services/scheduleRequests";
import Home from "../components/Home";

// Utility functions
const formatTopicsToEvents = (scheduleTopics) => {
  const events = [];
  for (const topic of scheduleTopics) {
    const event = {
      title: `${topic["title"]} - ${topic["hours"]}h `,
      date: topic["study_date"],
    };
    events.push(event);
  }
  return events;
};

function HomeContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState(null);

  const updatePageData = async () => {
    const response = await getScheduleTopics();

    if (response.ok) {
      const scheduleTopics = await response.json();
      const fetchedEvents = formatTopicsToEvents(scheduleTopics);
      setEvents(fetchedEvents);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updatePageData();
  }, []);
  return (
    <>
      {isLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Home events={events} />
      )}
    </>
  );
}

export default HomeContainer;
