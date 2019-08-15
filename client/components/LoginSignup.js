import React from 'react'

const LoginSignup = props => {
  return (
    <div>
      <form onSubmit={props.handleSubmit}>
        {props.displayName === 'Sign Up' ? (
          <React.Fragment>
            <label htmlFor="username">
              <small>Username</small>
            </label>
            <input name="username" type="text" onChange={props.handleChange} />{' '}
          </React.Fragment>
        ) : (
          <div />
        )}

        <div>
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <input name="email" type="text" onChange={props.handleChange} />
        </div>
        <div>
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input
            name="password"
            type="password"
            onChange={props.handleChange}
          />
        </div>
        <div>
          <button type="submit">{props.displayName}</button>
        </div>
      </form>
    </div>
  )
}

export default LoginSignup
