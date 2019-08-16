import React from 'react'
import LoginSignup from './LoginSignup'
import firebase from 'firebase'
import * as yup from 'yup'
import {validationLogin} from './utils'
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
    const valid = await validationLogin.isValid(this.state)
    if (valid) {
      console.log('hi i am valid')
      try {
        const login = await firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password)
        if (login) {
          alert('you have logged in')
        }
      } catch (error) {
        alert(error.message)
      }
    } else {
      console.log('hi im not valid')
    }
  }

  render() {
    return (
      <LoginSignup
        displayName="Log In"
        handleSubmit={this.handleSubmit}
        handleChange={this.handleChange}
        disabled={false}
      />
    )
  }
}

export default Login
