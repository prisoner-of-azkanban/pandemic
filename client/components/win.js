import React from 'react'
import {Button, Nav, Container, Col} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

const Win = () => {
  return (
    <div className="home-page">
      <Container className="home-page-container">
        <Col>
          <h1 id="header">Win</h1>
          <br />
          <p id="header-sub">Thank you for saving the world!</p>
        </Col>
        <div>
          <Button variant="outline-light" className="main-btn">
            <LinkContainer to="/waitingroom">
              <Nav.Link className="main-btn-text">Play Again</Nav.Link>
            </LinkContainer>
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default Win
