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
        eventKey="generate-schedule"
        onClick={() => {
          navigate("/generate-schedule");
        }}
      >
        Generate Schedule
      </Nav.Link>
      <Nav.Link
        eventKey="/all-plans"
        onClick={() => {
          navigate("/all-plans");
        }}
      >
        All Plans
      </Nav.Link>
      <Nav.Link
        eventKey="/search-plans"
        onClick={() => {
          navigate("/search-plans");
        }}
      >
        Search Plans
      </Nav.Link>
      <Nav.Link
        eventKey="/create-plan"
        onClick={() => {
          navigate("/create-plan");
        }}
      >
        Create Plan
      </Nav.Link>
      <Nav.Link eventKey="/account" onClick={() => navigate("/account")}>
        Account
      </Nav.Link>
    </Nav>
  );
}

export default MainNav;
