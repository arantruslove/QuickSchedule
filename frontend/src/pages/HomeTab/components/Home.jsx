import React from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

function Home() {
  const events = [
    {
      title: "Event 1",
      start: "2024-06-29",
    },
    {
      title: "Event 2",
      start: "2024-06-29",
    },
    {
      title: "Event 3",
      start: "2024-06-27",
    },
    // Add more events here
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <FullCalendar
        plugins={[listPlugin]}
        initialView="listWeek"
        height="100%"
        firstDay={1}
        events={events}
        allDayText="" // Change the all-day text to your custom text
      />
    </div>
  );
}

export default Home;
