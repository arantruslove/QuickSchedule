import { useState, useRef, useEffect } from "react";
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
  const inputRef = useRef(null);

  // Focus the input when the modal is shown
  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  // Event handling
  const handleInputTextChange = (newText) => {
    setInputText(newText);
  };

  const intermediateHandleClose = () => {
    setInputText("");
    handleClose();
  };

  return (
    <Modal show={show} onHide={intermediateHandleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          className="mb-3"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitClick(inputText);
            setInputText("");
          }}
        >
          <Form.Control
            ref={inputRef}
            placeholder={inputPlaceholder}
            value={inputText}
            onChange={(event) => handleInputTextChange(event.target.value)}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={intermediateHandleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => onSubmitClick(inputText)}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TextInputModal;
