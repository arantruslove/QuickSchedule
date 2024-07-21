import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

import HomeModal from "./HomeModal";

function Home({ events, displayModal }) {
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
        />
      </div>
    </>
  );
}

export default Home;
