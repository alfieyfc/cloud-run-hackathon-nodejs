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

  var input = [
    arenaDims[0],
    arenaDims[1],
    numPlayers,
    me.x,
    me.y,
    me.score,
    directions.indexOf(me.direction),
    Number(me.wasHit),
    topPlayer.x,
    topPlayer.y,
    topPlayer.score,
    directions.indexOf(topPlayer.direction),
    Number(topPlayer.wasHit),
    closestPlayer.x,
    closestPlayer.y,
    closestPlayer.score,
    directions.indexOf(closestPlayer.direction),
    Number(closestPlayer.wasHit)
  ]

  var wIL = Array.from({ length: wILHeight }, () => { return Array.from({ length: wILWidth }, () => { return Math.random() }) });
  var wLO = Array.from({ length: wLOHeight }, () => { return Array.from({ length: wLOWidth }, () => { return Math.random() }) });
  var output = math.multiply(math.multiply(input, wIL), wLO)
  // console.log(output)
  var output_3 = output.map((e) => { return Math.pow(e, 3) })
  // console.log(output_3)
  var sum = output_3.reduce((a, b) => { return a + b })
  // console.log(sum)
  var prob = output_3.map((e) => { return e / sum })
  // console.log(prob)
  action = moves[prob.indexOf(pickOne(prob))];
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
