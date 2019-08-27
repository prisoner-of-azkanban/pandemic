import React from 'react'
import {Modal} from 'react-bootstrap'

const InstructionModal = props => {
  // const eventCards = props.currentUser.hand.filter(
  //   card => card.type === 'event'
  // )
  return (
    <Modal
      size="lg"
      show={props.showModal}
      onHide={() => props.toggleModal()}
      aria-labelledby="modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="modal-sizes-title-lg">Instructions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4 className="help-modal-header">Welcome to Pandemic!</h4>
      </Modal.Body>
    </Modal>
  )
}

export default InstructionModal
