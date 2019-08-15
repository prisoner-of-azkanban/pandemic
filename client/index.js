import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'
//../node_modules/bootstrap/dist/css/bootstrap.min.css

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../public/style.css'

ReactDOM.render(
  // <Provider store={store}>
  <Router history={history}>
    <App />
  </Router>,
  // </Provider>,
  document.getElementById('app')
)
