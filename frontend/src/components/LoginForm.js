import React from 'react'
import PropTypes from 'prop-types'
import './LoginForm.css'

const LoginForm = ({ onSubmit,
  username, handleUsernameChange,
  password, handlePasswordChange }) => (
  <>
    <form id="loginForm" onSubmit={onSubmit}>
      <label htmlFor="Username">Username</label>
      <input type="text"
        value={username}
        id="Username"
        name="Username"
        onChange={handleUsernameChange} />

      <label htmlFor="Password">Password</label>
      <input type="password"
        value={password}
        id="Password"
        name="Password"
        onChange={handlePasswordChange} />

      <button id="loginButton" type="submit">Login</button>
    </form>
  </>
)

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  handlePasswordChange: PropTypes.func.isRequired
}

export default LoginForm