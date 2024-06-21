import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function TextInputModal({
  heading,
  inputPlaceholder,
  show,
  handleClose,
  onSubmitClick,
}) {
  const [inputText, setInputText] = useState("");

  // Event handling
  const handleInputTextChange = (newText) => {
    setInputText(newText);
  };

  return (
    <Modal show={show} onHide={handleClose} centered="true">
      <Modal.Header closeButton>
        <Modal.Title>{heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <Form.Control
            placeholder={inputPlaceholder}
            value={inputText}
            onChange={(event) => handleInputTextChange(event.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            {
              onSubmitClick(inputText);
              setInputText("");
            }
          }}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TextInputModal;
