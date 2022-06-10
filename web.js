const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const util = require('./util')

const math = require('mathjs')

const directions = ['N', 'E', 'S', 'W'];
const moves = ['T', 'F', 'R', 'L'];

const pHeight = process.env.P_HEIGHT || 10;
const wILHeight = 18;
const wILWidth = pHeight;
const wLOHeight = pHeight;
const wLOWidth = 4;

require('dotenv').config();

const port = process.env.PORT || 8080;
const myUrl = process.env.MY_URL || "https://foo.com";

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!');
});

app.post('/', function (req, res) {

  arenaDims = req.body.arena.dims;
  state = req.body.arena.state;
  numPlayers = Object.keys(state).length;
  me = state[myUrl]
  topPlayer = util.topPlayerState(state);
  closestPlayer = util.closestPlayerState(state, me, myUrl);

  action = util.controlAction(myUrl, state, arenaDims)
  res.send(action);
});

if (process.env.NODE_ENV !== 'test') {
  console.log(`MY_URL is ${myUrl}`)
  app.listen(port, () => console.log(`Listening on port ${port}`))
}

module.exports = app

pickOne = (list) => {
  var index = 0;
  var r = Math.random()

  while (r > 0) {
    r = r - list[index]
    index++
  }
  index--
  return list[index]
}
