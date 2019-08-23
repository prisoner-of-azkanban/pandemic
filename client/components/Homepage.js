import React from 'react'
import {Button, Nav, Container, Col} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import firebase from 'firebase'

class Homepage extends React.Component {
  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    await firebase.auth().onAuthStateChanged(loggedinUser => {
      if (loggedinUser) {
        this.props.history.push('/waitingroom')
      }
    })
  }

  render() {
    return (
      <div className="home-page">
        <Container className="home-page-container">
          <Col>
            <h1 id="header">Pandemic Online</h1>
            <br />
            <p id="header-sub">Stop the virus, save the world.</p>
          </Col>
          <div>
            <Button variant="outline-light" className="main-btn">
              <LinkContainer to="/login">
                <Nav.Link className="main-btn-text">Log In</Nav.Link>
              </LinkContainer>
            </Button>
            <Button variant="outline-light" className="main-btn">
              <LinkContainer to="/signup">
                <Nav.Link className="main-btn-text">Sign Up</Nav.Link>
              </LinkContainer>
            </Button>
          </div>
        </Container>
      </div>
    )
  }
}

export default Homepage
