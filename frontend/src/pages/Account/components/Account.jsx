import PageLayout from "../../../components/PageLayout";
import { Card, Form, Button } from "react-bootstrap";

function Account({
  onLogoutClick,
  onChangePasswordClick,
  onDeleteAccountClick,
}) {
  return (
    <PageLayout>
      <Card>
        <Card.Body>
          <Card.Title>Account</Card.Title>
          <Form>
            <Form.Group>
              <Form.Label className="d-block">Email address:</Form.Label>
              <Form.Label className="d-block">user@example.com</Form.Label>
            </Form.Group>

            <Button
              variant="secondary"
              className="mt-3"
              onClick={onLogoutClick}
            >
              Logout
            </Button>
            <Button
              variant="primary"
              className="mt-3"
              onClick={onChangePasswordClick}
            >
              Change Password
            </Button>
            <Button
              variant="danger"
              className="mt-3"
              onClick={onDeleteAccountClick}
            >
              Delete Account
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </PageLayout>
  );
}

export default Account;
