import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

function HomeModal() {
  const navigate = useNavigate();
  return (
    <Modal show={true} centered>
      <Modal.Header>
        <Modal.Title>No Schedule to Display</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        There is no revision schedule yet to display...
        <ol className="mt-3">
          <li>
            If this is your first time logging in or you are yet to add any
            Plans, please click{" "}
            <span style={{ fontWeight: "bold" }}>Add Plans</span>.
          </li>
          <li>
            If you have already added Plans and Topics, please click{" "}
            <span style={{ fontWeight: "bold" }}>Generate Schedule</span>.
          </li>
        </ol>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => navigate("/create-plan")}>
          Add Plans
        </Button>
        <Button
          variant="success"
          onClick={() => navigate("/generate-schedule")}
        >
          Generate Schedule
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default HomeModal;
