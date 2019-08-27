import React from 'react'
import {Form, Button} from 'react-bootstrap'

const LoginSignup = props => {
  return (
    <div className="login-page">
      {props.displayName === 'Sign Up' ? (
        <p id="header-sub">Sign up for the resistance</p>
      ) : (
        <p id="header-sub">Sign into your account</p>
      )}
      <Form onSubmit={props.handleSubmit}>
        {props.displayName === 'Sign Up' ? (
          <div>
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              type="text"
              onChange={props.handleChange}
            />
          </div>
        ) : (
          <div />
        )}

        <div>
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            type="email"
            onChange={props.handleChange}
          />
        </div>
        <div>
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            onChange={props.handleChange}
          />
        </div>
        <div>
          <Button
            type="submit"
            variant="outline-dark"
            disabled={props.disabled}
            className="main-btn"
          >
            {props.displayName}
          </Button>
        </div>
      </Form>
      <div>
        <Button
          type="submit"
          variant="outline-dark"
          className="main-btn"
          onClick={props.handleBack}
        >
          Return to Home Screen
        </Button>
      </div>
    </div>
  )
}

export default LoginSignup
