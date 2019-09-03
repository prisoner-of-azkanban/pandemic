# Online Pandemic

Can you and your friends save the world?
Based on the popular board game, Online Pandemic is a cooperative game for four players. As members of an elite disease control team, you must keep four deadly diseases at bay. Work together as you travel the globe to treat infections while collecting the cards you need to discover a cure for each disease. But the clock is ticking as outbreaks and epidemics fuel the spreading plagues. As a cooperative game, players win or lose together. Only by working together can you keep the outbreaks in check and find the cures in time!

## How To Play

### Heroku deployment

Go to <http://onlinepandemicgame.herokuapp.com> and sign up. Create a room, have some friends join, start the game and deal out cards.

### Local Host

Alternatively, you can run Online Pandemic from the command line. You will need to create your own Firebase Firestore. In firebase-server folder, include a secrets.js file with the following (Firebase should give you everything):

```
//firebase
let config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
}
module.exports = {config}
```

Run the following commands in the command line:

* npm install
* npm run start-dev

This will run Online Pandimic on localhost:8080
You will still need to sign up to play

### Deviations from the standard board game

This online version of Pandemic does not include roles or event cards. To compensate, everyone is a scientist (only need four cards of a color to discover the cure), and there are only four epidemic cards. There is also no hand size limit. You are also allowed to build more than six research stations. You can read the instruction and help menus in game for more details.

## Tech Stack

**Built with:**

* JavaScript
* React
* HTML5 Canvas
* Firebase
* CSS
* Bootstrap

## Authors

**Built by:**

* [Lara Seren](https://github.com/dotsalot)
* [Rebecca Rossman](https://github.com/rrossman25)
* [Yuting Zhang](https://github.com/yzhang729)
