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

  handleSubmit = async event => {
    event.preventDefault()
    try {
      const login = await firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
      if (login) {
        alert('you have logged in')
      }
    } catch (error) {
      var errorCode = error.code
      var errorMessage = error.message
      console.log(errorCode, errorMessage)
      alert(error.message)
    }
  }

  render() {
    const disabled =
      !(this.state.email.length &&
      this.state.password.length &&
      this.state.email.includes('@'))
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
