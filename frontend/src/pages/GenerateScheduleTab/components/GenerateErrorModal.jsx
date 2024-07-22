import { Modal } from "react-bootstrap";

function GenerateErrorModal({ show, onHide }) {
  return (
    <Modal show={show} centered onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Error...</Modal.Title>
      </Modal.Header>

      <Modal.Body>There was an error generating the schedule.</Modal.Body>
    </Modal>
  );
}

export default GenerateErrorModal;
