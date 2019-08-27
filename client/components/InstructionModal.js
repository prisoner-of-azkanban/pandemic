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
        <h3 className="help-modal-header">Welcome to Pandemic!</h3>
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
              too much)
            </li>
            <li>
              not enough player cards are left when needed (your team runs out
              of time)
            </li>
          </ul>
        </p>
        <h4 className="help-modal-header">Instructions</h4>
        <h4 className="help-modal-subheader">Start The Game</h4>
        <p>Press the Deal Cards button to start the game.</p>
        <h4 className="help-modal-subheader">Player Turns</h4>
        <p>
          On your turn, you will have the ability to do four actions: move to a
          new city, build a research station, treat disease, share knowledge, or
          discover a cure. Click on the Help button for further details on these
          options. After completing your four actions, your turn ends.
        </p>
        <h4 className="help-modal-subheader">Turn End</h4>
        <p>Turn End consists of drawing cards and infecting cities</p>
        <p>
          <span className="modal-bold">Draw Cards:</span> You are given 2 cards.
          If either of them are Epidemic cards, the Epidemic(s) resolve(s)
          before continuing.
        </p>
        <div>
          <span className="modal-bold">Epidemic Resolution:</span>
          <ol>
            <li>
              Increase: The infection rate marker is moved forward 1 space on
              the Infection Rate Tracker
            </li>
            <li>
              Infect: The bottom card of the Infection Deck is drawn and
              infected. 3 cubes of the city's color are placed in the city, but
              if the city already has 1 cube of that color, cubes are placed in
              the city until it is at 3 cubes and then the city outbreaks. The
              card is discared into the Infection Discard pile.
            </li>
            <li>
              Intesify: The Infection Discard pile is reshuffled and placed on
              top of the Infection Deck.
            </li>
          </ol>
          <p>
            It is possible that 2 Epidemic cards are drawn at once. In this case
            the Epidemic Resolution steps are done once and then once again
          </p>
        </div>
        <p>
          <span className="modal-bold">Infect:</span> Infection Cards are
          flipped over from the Infection Deck matching the current Infection
          Rate. The cities are infected one at a time by placing a single cube
          matching the city's color. If a city already has 3 cubes, it
          outbreaks.
        </p>
        <p>
          <span className="modal-bold">Outbreak:</span> A city outbreaks when a
          4th cube of the same color needs to be placed on the city. In this
          case, instead of placing a 4th cube, all connected cities receive one
          cube of the outbreaking city's color.
        </p>

        <h4 className="help-modal-header">Map and Game Pieces</h4>
        <h4 className="help-modal-subheader">Map</h4>
        <div className="modal-img-large">
          <img src="https://i.imgur.com/P1jNm3u.png" width="100%" />
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
        <h4 className="help-modal-subheader">Game Pieces</h4>
        <p>
          <span className="modal-bold">Cities:</span> Cities are marked on the
          map by colored circles, with lines showing what cities are connected.
          Each city has a color attribute that is used to determine what color
          disease cubes to place during infection steps.
        </p>
        <p>
          <span className="modal-bold">Player Pawns:</span> Player pawns are
          represented by small colored circles. A player's pawn will appear
          within the city circle where the player is located.
        </p>
        <p>
          <span className="modal-bold">Research Centers:</span> Research centers
          are represented by small white circles in the center of a city circle.
        </p>
        <p>
          <span className="modal-bold">Disease Cubes:</span> Disease cubes are
          shown above city circles. If a city is infected, a colored square with
          a number indicating the number of disease cubes will appear.
        </p>
        <p>
          <span className="modal-bold">Cube Counter:</span> Shows how many
          disease cubes are left. Running out of disease cubes in any color
          results in a loss!
        </p>
        <p>
          <span className="modal-bold">Infection Rate:</span> Indicates how many
          cities will be infected during the infect step.
        </p>
        <p>
          <span className="modal-bold">Outbreak Counter:</span> Shows how many
          outbreaks have occurred.
        </p>
        <p>
          <span className="modal-bold">Cure Markers:</span> Cure markers will
          appear when a disease is cured. If the disease is eradicated, an X
          will appear on the marker.
        </p>
        <h3 className="help-modal-header">In Game Menu</h3>
        <p>
          The in game menu provides information about the current game state.
        </p>
        <h4 className="help-modal-subheader">Player Information</h4>
        <p>
          Your username, along with pawn color will appear at the top. Your
          current location will also be stated.
        </p>
        <h4 className="help-modal-subheader">Curent Turn</h4>
        <p>
          This displays information about who's turn it currently is and how
          many actions are remaining.
        </p>
        <h4 className="help-modal-subheader">Move Menu</h4>
        <p>
          The move menu shows what options you have during your turn, and the
          current status of the game.
        </p>
        <p>For additional help on available moves, refer to the Help menu.</p>
        <h4 className="help-modal-subheader">Hand Information</h4>
        <p>
          Your Cards are displayed here. You can also click on the other
          player's names to view their hand and location. Epidemic List contains
          all the cities that were affected by the epidemic cards. Infect
          Discard lists all the cities currently in the infection discard pile.
        </p>
        <h3 className="help-modal-header">Chat</h3>
        <p>
          The chat feature allows you to communicate with your teammates. All
          actions and game state changes will also appear in the chat history.
        </p>
      </Modal.Body>
    </Modal>
  )
}

export default InstructionModal
