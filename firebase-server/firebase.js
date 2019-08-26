const firebase = require('firebase')
require('firebase/firestore')
const {config} = require('./secrets')

console.log(config)

let app = firebase.initializeApp(config)

const db = firebase.firestore()

module.exports = {db, app}
