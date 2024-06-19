import { Nav } from "react-bootstrap";

function MainNav() {
  return (
    <Nav className="flex-column" variant="pills">
      <Nav.Link href="#home">Schedule</Nav.Link>
      <Nav.Link href="#link1">Create Schedule</Nav.Link>
      <Nav.Link href="#link2">All Courses</Nav.Link>
      <Nav.Link href="#link3">Course Search</Nav.Link>
      <Nav.Link href="#disabled">Create Course</Nav.Link>
      <Nav.Link href="/account">Account</Nav.Link>
    </Nav>
  );
}

export default MainNav;
