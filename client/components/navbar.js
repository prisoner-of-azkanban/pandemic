import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => (
  <div>
    <h1>Pandemic</h1>
    <nav>
      <div>
        {/* The navbar will show these links before you log in */}
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/game">Games</Link>
      </div>
    </nav>
    <hr />
  </div>
)

export default Navbar
