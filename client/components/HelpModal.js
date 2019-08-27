import React from 'react'
import {Modal} from 'react-bootstrap'

const HelpModal = props => {
  // const eventCards = props.currentUser.hand.filter(
  //   card => card.type === 'event'
  // )
  return (
    <Modal
      size="lg"
      show={props.showHelpModal}
      onHide={() => props.toggleHelpModal()}
      aria-labelledby="modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="modal-sizes-title-lg">Help</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4 className="help-modal-header">Changes to Game</h4>
        <p>Role and event cards have been removed from the game.</p>
        <p>
          To compensate, there are five extra city cards in the player card
          deck.
        </p>
        <h4 className="help-modal-header">Move</h4>
        <h5 className="help-modal-subheader">Drive/Ferry</h5>
        <p>Move to any city connected by a line to the one you are in</p>
        <h5 className="help-modal-subheader">Direct Flight</h5>
        <p>Discard a City card to move to the city named on the card</p>
        <h5 className="help-modal-subheader">Charter Flight</h5>
        <p>
          Discard the City card that matches the city you are in to move to any
          city
        </p>
        <h5 className="help-modal-subheader">Shuttle Flight</h5>
        <p>
          Move from a city with a research station to any other city that has a
          research station
        </p>
        <h4 className="help-modal-header">Research</h4>
        <p>
          Discard the City card that matches the city you are in to place a
          research station there. If all 6 research stations have been built,
          move a research station from anywhere on the map.
        </p>
        <h4 className="help-modal-header">Treat</h4>
        <p>
          Remove 1 disease cube from the city you are in. If this disease color
          has been cured, remove all cubes of that color from the city you are
          in. If the last cube of a cured disease is removed from the board,
          this disease is now eradicated.
        </p>
        <h4 className="help-modal-header">Share Knowledge</h4>
        <p>
          Either give the City card that matches the city you are in to another
          player or take the City card that matches the city you are in from
          another player. The other player must also be in the city with you.
        </p>
        <h4 className="help-modal-header">Cure</h4>
        <p>
          At any research station, discard 5 City cards of the same color from
          your hand to cure the disease of that color
        </p>
        {/* <h4 className="help-modal-header">Event</h4>
        {eventCards.length ? (
          <div>
            {eventCards.map(card => (
              <p key={card.title}>
                {card.title}: {card.description}
              </p>
            ))}
          </div>
        ) : (
          <p>You have no event cards</p>
        )}
        <h4 className="help-modal-header">Role</h4>
        <p>{props.currentUser.role.actionOne}</p> */}
      </Modal.Body>
    </Modal>
  )
}

export default HelpModal
