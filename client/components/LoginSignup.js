import React from 'react'
import {Form, Button} from 'react-bootstrap'

const LoginSignup = props => {
  return (
    <div>
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
          <Button type="submit" variant="primary">
            {props.displayName}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default LoginSignup
