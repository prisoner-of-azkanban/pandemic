import React from 'react'
import {Modal} from 'react-bootstrap'

const InstructionModal = props => {
  // const eventCards = props.currentUser.hand.filter(
  //   card => card.type === 'event'
  // )
  return (
    <Modal
      size="lg"
      show={props.showInstructionModal}
      onHide={() => props.toggleInstructionModal()}
      aria-labelledby="modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="modal-sizes-title-lg">Instructions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4 className="help-modal-header">Welcome to Pandemic!</h4>
        <p>Can you and your friends save the world?</p>
        <p>
          Based on the popular board game, Pandemic Online is a cooperative game
          for four players. As members of an elite disease control team, you
          must keep four deadly diseases at bay. Work together as you travel the
          globe to treat infections while collecting the cards you need to
          discover a cure for each disease. But the clock is ticking as
          outbreaks and epidemics fuel the spreading plagues. As a cooperative
          game, players win or lose together. Only by working together can you
          keep the outbreaks in check and find the cures in time!
        </p>
        <h4 className="help-modal-header">Goal</h4>
        <p>
          The goal of the game is to discover cures for all 4 diseases. Players
          lose if:
          <ul>
            <li>8 outbreaks occur (a worldwide panic happens)</li>
            <li>
              not enough disease cubes are left when needed (a disease spreads
              too much
            </li>
            <li>
              not enough player cards are left when needed (your team runs out
              of time)
            </li>
          </ul>
        </p>
        <h4 className="help-modal-header">Instructions</h4>
        <p>Press the Deal Cards button to start the game.</p>
        <p>
          On your turn, you will have the ability to do four actions: move to a
          new city, build a research station, treat disease, share knowledge, or
          discover a cure. Click on the Help button for further details on these
          options.
        </p>
        <h4 className="help-modal-header">Map</h4>
        <div className="modal-img-large">
          <img src="https://i.imgur.com/4LGe6hv.png" width="100%" />
        </div>
        <p>
          The main game map shows the locations of the cities, players, and
          research centers, as well as how far the diseases have spread in each
          city.
        </p>
        <div className="modal-img-large">
          <img src="https://i.imgur.com/dAGKCyr.png" width="50%" />
        </div>
        <p>
          In the image above, there is one research center in Atlanta, two
          players in Chicago, one player in New York, and one player and one
          blue disease cube in Washington.
        </p>
        <p>
          <span className="modal-bold">Cube Counter:</span> Shows how many
          disease cubes are left. Running out of disease cubes in any color
          results in a loss!
        </p>
        <p>
          <span className="modal-bold">Infection Rate:</span> Indicates how many
          disease cubes will be placed during an outbreak
        </p>
        <p>
          <span className="modal-bold">Outbreak Counter:</span> Shows how many
          outbreaks have occurred
        </p>
        <h4 className="help-modal-header">Move Menu</h4>
        <p>
          The move menu shows you whose turn it is, what options you have during
          your turn, and the current status of the game.
        </p>
        <p>For additional help on available moves, refer to the Help menu.</p>
      </Modal.Body>
    </Modal>
  )
}

export default InstructionModal
