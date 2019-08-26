import React from 'react'
import ReactDOM from 'react-dom'
import {Router} from 'react-router-dom'
import history from './history'
import App from './app'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../public/style.css'

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('app')
)
