import { useNavigate } from "react-router-dom";
import { ListGroup, Button } from "react-bootstrap";

/**Page component that displays account details.*/
function Account({ email, onLogoutButtonClick, onDeleteButtonClick }) {
  const navigate = useNavigate();

  return (
    <ListGroup>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">Email</div>
          {email}
        </div>
      </ListGroup.Item>
      <Button variant="secondary" onClick={onLogoutButtonClick}>
        Logout
      </Button>
      <Button
        variant="success"
        onClick={() => navigate("/initiate-password-reset/")}
      >
        Change Password
      </Button>
      <Button variant="danger" onClick={onDeleteButtonClick}>
        Delete Account
      </Button>
    </ListGroup>
  );
}

export default Account;
