const firebase = require('firebase')
require('firebase/firestore')

var config = {
  apiKey: 'AIzaSyAMQuH4xLOL4t5Esz28hW8GONs7fIKvhDo',
  authDomain: 'pandemic-online-38cdd.firebaseapp.com',
  databaseURL: 'https://pandemic-online-38cdd.firebaseio.com',
  projectId: 'pandemic-online-38cdd',
  storageBucket: '',
  messagingSenderId: '517649764640',
  appId: '1:517649764640:web:043e7a9de43c0663'
}

let app = firebase.initializeApp(config)

const db = firebase.firestore()

module.exports = {db, app, config}
