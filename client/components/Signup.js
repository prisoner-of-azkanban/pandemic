import React from 'react'
import LoginSignup from './LoginSignup'
import firebase from 'firebase'
import * as yup from 'yup'
import {app, db} from '../../firebase-server/firebase'
import {validationSignUp} from './utils'

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

  handleSubmit = async event => {
    event.preventDefault()
    const valid = await validationSignUp.isValid(this.state)
    if (valid) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(user =>
          db
            .collection('users')
            .doc(user.user.uid)
            .set({username: this.state.username, email: this.state.email})
        )
        .catch(function(error) {
          var errorCode = error.code
          var errorMessage = error.message
          console.log(errorCode, errorMessage)
        })
    }
  }

  render() {
    return (
      <LoginSignup
        displayName="Sign Up"
        handleSubmit={this.handleSubmit}
        handleChange={this.handleChange}
        disabled={this.state.password.length < 8}
      />
    )
  }
}

export default Signup
