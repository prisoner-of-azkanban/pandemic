import React from 'react'
import LoginSignup from './LoginSignup'
import firebase from 'firebase'

import {app, db} from '../../firebase-server/firebase'

class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: ''
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = event => {
    console.log(this.state)
    event.preventDefault()
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => alert('you have logged in'))
      .catch(function(error) {
        var errorCode = error.code
        var errorMessage = error.message
        console.log(errorCode, errorMessage)
        alert(errorMessage)
      })
  }

  render() {
    const disabled = !(
      this.state.email.length &&
      this.state.password.length &&
      this.state.email.includes('@')
    )
    return (
      <LoginSignup
        displayName="Log In"
        handleSubmit={this.handleSubmit}
        handleChange={this.handleChange}
        disabled={disabled}
      />
    )
  }
}

export default Login
