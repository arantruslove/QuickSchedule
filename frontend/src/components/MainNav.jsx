import { Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

function MainNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Nav
      className="flex-column"
      variant="pills"
      activeKey={location["pathname"]}
    >
      <Nav.Link
        eventKey="/home"
        onClick={() => {
          navigate("/home");
        }}
      >
        Home
      </Nav.Link>
      <Nav.Link
        eventKey=""
        onClick={() => {
          navigate("/create-schedule");
        }}
      >
        Create Schedule
      </Nav.Link>
      <Nav.Link
        eventKey="/all-courses"
        onClick={() => {
          navigate("/all-courses");
        }}
      >
        All Courses
      </Nav.Link>
      <Nav.Link
        eventKey="/course-search"
        onClick={() => {
          navigate("/course-search");
        }}
      >
        Course Search
      </Nav.Link>
      <Nav.Link
        eventKey="/create-course"
        onClick={() => {
          navigate("/create-course");
        }}
      >
        Create Course
      </Nav.Link>
      <Nav.Link eventKey="/account" onClick={() => navigate("/account")}>
        Account
      </Nav.Link>
    </Nav>
  );
}

export default MainNav;
