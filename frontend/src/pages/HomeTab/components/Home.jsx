import React from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

function Home({ events }) {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <FullCalendar
        plugins={[listPlugin]}
        initialView="listWeek"
        height="100%"
        firstDay={1}
        events={events}
        allDayText=""
      />
    </div>
  );
}

export default Home;
