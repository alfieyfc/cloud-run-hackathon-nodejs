const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const utils = require('./util')
const util = require('node:util');

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

  var arenaDims = req.body.arena.dims;
  var state = req.body.arena.state;
  var me = state[myUrl]

  var cells_length = arenaDims[0] * arenaDims[1]
  var cells = Array(cells_length).fill(0)
  for (key in state) {
    var i = state[key].x + state[key].y * arenaDims[0]
    cells[i] = state[key].score
  }

  var input = Array(cells_length + 6)
  input[0] = arenaDims[0]
  input[1] = arenaDims[1]
  input[2] = me.x
  input[3] = me.y
  input[4] = directions.indexOf(me.direction)
  input[5] = Number(me.wasHit)
  for (var i = 6; i < input.length; i++) {
    input[i] = cells[i - 6]
  }

  // var wIL = Array.from({ length: wILHeight }, () => { return Array.from({ length: wILWidth }, () => { return Math.random() }) });
  // var wLO = Array.from({ length: wLOHeight }, () => { return Array.from({ length: wLOWidth }, () => { return Math.random() }) });
  // var output = math.multiply(math.multiply(input, wIL), wLO)
  // // console.log(output)
  // var output_3 = output.map((e) => { return Math.pow(e, 3) })
  // // console.log(output_3)
  // var sum = output_3.reduce((a, b) => { return a + b })
  // // console.log(sum)
  // var prob = output_3.map((e) => { return e / sum })
  // console.log(prob)
  // action = moves[prob.indexOf(pickOne(prob))];
  action = moves[Math.floor(Math.random() * 4)];
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
