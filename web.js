const express = require('express');
const app = express();
const bodyParser = require('body-parser');

require('dotenv').config();

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!');
});

app.post('/', function (req, res) {

  // console.log(req.body)

  state = req.body.arena.state;
  // console.log(state)

  let me = state[process.env.MY_URL];
  let potential_target;
  let action;
  for (var key in state) {
    current_player = state[key]
    if (key != process.env.MY_URL) {

      // if in the same row and within 3 tiles
      if (current_player.x == me.x && Math.abs(me.y - current_player.y) < 3) {
        potential_target = current_player;
        if (potential_target.x > me.x) { // target is on East side
          console.log('Target at East')
          if (me.direction == 'E') {
            action = 'T'
            break;
          } else if (me.direction == 'N') {
            action = 'R'
          } else {
            action = 'L'
          }
        } else {                           // target is on West side
          console.log('Target at West')
          if (me.direction == 'W') {
            action = 'T'
            break;
          } else if (me.direction == 'N') {
            action = 'L'
          } else {
            action = 'R'
          }
        }
      }

      // if in the same row and within 3 tiles
      if (current_player.y == me.y && Math.abs(me.x - current_player.x) < 3) {
        potential_target = current_player
        if (potential_target.y > me.y) {  //target is on South side
          console.log('Target at South')
          if (me.direction == 'S') {
            console.log('Target at South')
            action = 'T'
            break;
          } else if (me.direction == 'E') {
            action = 'R'
          } else {
            action = 'L'
          }
        } else {                           //target is on North side
          console.log('Target at North')
          if (me.direction == 'N') {
            action = 'T'
            break;
          } else if (me.direction == 'W') {
            action = 'R'
          } else {
            action = 'L'
          }
        }
      }
    }
  }
  console.log(potential_target)

  const moves = ['F', 'L', 'R'];
  if (!action)
    action = moves[Math.floor(Math.random() * moves.length)];

  console.log(action)
  res.send(action);
});

app.listen(process.env.PORT || 8080);
