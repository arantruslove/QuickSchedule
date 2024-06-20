import { Card, Button, Placeholder } from "react-bootstrap";

function Account({
  isLoading,
  email,
  onLogoutClick,
  onChangePasswordClick,
  onDeleteAccountClick,
}) {
  return (
    <Card>
      <Card.Body>
        <Card.Title className="mb-3">Account</Card.Title>
        <div className="mb-3">
          <strong>Email address:</strong>
          {isLoading ? (
            <Placeholder as="div" animation="glow">
              <Placeholder xs={2} />
            </Placeholder>
          ) : (
            <div className="text-muted">{email}</div>
          )}
        </div>

        <div className="d-flex justify-content-start mt-4">
          <Button variant="secondary" className="me-2" onClick={onLogoutClick}>
            Logout
          </Button>
          <Button
            variant="primary"
            className="me-2"
            onClick={onChangePasswordClick}
            disabled={isLoading}
          >
            Change Password
          </Button>
          <Button
            variant="danger"
            onClick={onDeleteAccountClick}
            disabled={isLoading}
          >
            Delete Account
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Account;
