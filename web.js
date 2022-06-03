const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const util = require('./util')

require('dotenv').config();

const port = process.env.PORT;
const myUrl = process.env.MY_URL;

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!');
});

app.post('/', function (req, res) {

  arenaDims = req.body.arena.dims;
  state = req.body.arena.state;
  numPlayers = Object.keys(state).length;
  me = state[process.env.MY_URL];
  // TODO: Get state of top #1 Player
  topPlayer = util.topPlayerState(state);
  // TODO: Get state of the Player closest to me
  closestPlayer = util.closestPlayerState(state, me, myUrl);

  input = [arenaDims[0], arenaDims[1], numPlayers, me.x, me.y, me.score, me.direction, me.wasHit, topPlayer.x, topPlayer.y, topPlayer.score, topPlayer.direction, topPlayer.wasHit, closestPlayer.x, closestPlayer.y, closestPlayer.score, closestPlayer.direction, closestPlayer.wasHit]
  // console.log(input)

  const move = ['T', 'F', 'L', 'R'];
  action = move[Math.floor(Math.random() * move.length)];
  res.send(action);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`))
}

module.exports = app

