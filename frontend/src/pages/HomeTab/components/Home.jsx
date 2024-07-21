import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

import HomeModal from "./HomeModal";

function Home({ events, displayModal }) {
  const initialDate = events[0]["date"];
  return (
    <>
      {displayModal && <HomeModal />}
      <div style={{ height: "100%", width: "100%" }}>
        <FullCalendar
          plugins={[listPlugin]}
          initialView="listWeek"
          height="100%"
          firstDay={1}
          events={events}
          allDayText=""
          initialDate={initialDate}
        />
      </div>
    </>
  );
}

export default Home;
