import React from 'react'
import {Button, Nav, Container, Col} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

const Lose = () => {
  return (
    <div className="home-page">
      <Container className="home-page-container">
        <Col>
          <h1 id="header">Loss</h1>
          <br />
          <p id="header-sub">Mankind has lost the war on disease</p>
        </Col>
        <div>
          <Button variant="outline-light" className="main-btn">
            <LinkContainer to="/login">
              <Nav.Link className="main-btn-text">Try Again</Nav.Link>
            </LinkContainer>
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default Lose
