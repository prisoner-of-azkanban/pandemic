import React from 'react'
import LoginSignup from './LoginSignup'
import firebase from 'firebase'

import {app, db} from '../../firebase-server/firebase'

class Signup extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      email: '',
      password: ''
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleBack = () => {
    this.props.history.push('/')
  }

  handleSubmit = event => {
    event.preventDefault()
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user =>
        db
          .collection('users')
          .doc(user.user.uid)
          .set({username: this.state.username, email: this.state.email})
      )
      .then(() => this.props.history.push('/waitingroom'))
      .catch(function(error) {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
        alert(errorMessage)
      })
  }

  render() {
    const disabled = !(
      this.state.password.length > 5 &&
      this.state.username.length &&
      this.state.email.length &&
      this.state.email.includes('@')
    )
    return (
      <LoginSignup
        displayName="Sign Up"
        handleSubmit={this.handleSubmit}
        handleChange={this.handleChange}
        handleBack={this.handleBack}
        disabled={disabled}
      />
    )
  }
}

export default Signup
