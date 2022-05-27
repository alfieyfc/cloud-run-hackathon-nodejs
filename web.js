const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var score = 0;

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

  // escape
  if (me.wasHit) {
    action = 'F'
    console.log(me.direction)
    switch (me.direction){
      case 'E':
        for (var key in state) {
          if (state[key].y == me.y){
            diff = state[key].x - me.x
            if(diff == 1 || me.x == 15){
              console.log(me)
              console.log(state[key])
              console.log("Facing E. Nowhere to go forward, turn!")
              action = 'R'
              break;
            }
          }
        }
        break;
      case 'W':
        for (var key in state) {
            if (state[key].y == me.y){
            diff = state[key].x - me.x
            if(diff == -1 || me.x == 0){
              console.log(me)
              console.log(state[key])
              action = 'R'
              console.log("Facing W. Nowhere to go forward, turn!")
              break;
            }
          }
        }
        break;
      case 'S':
        for (var key in state) {
            if (state[key].x == me.x){
            diff = state[key].y - me.y
            if(diff == 1 || me.y == 11){
              console.log(me)
              console.log(state[key])
              console.log("Facing S. Nowhere to go forward, turn!")
              action = 'R'
              break;
            }
          }
        }
        break;
      case 'N':
        for (var key in state) {
            if (state[key].x == me.x){
            diff = state[key].y - me.y
            if(diff == -1 || me.x == 0){
              console.log(me)
              console.log(state[key])
              console.log("Facing N. Nowhere to go forward, turn!")
              action = 'R'
              break;
            }
          }
        }
        break;
    }
    if (action == 'F')
      console.log("No one in front of me, run!")

  } else {

    for (var key in state) {
      current_player = state[key]
      if (key != process.env.MY_URL) {
        // if in the same col and within 3 tiles
        if (current_player.x == me.x && Math.abs(me.y - current_player.y) < 3) {
          potential_target = current_player;
          console.log(me)
          console.log(potential_target)
          if (potential_target.y > me.y) { // target is on South side
            console.log('Target at South')
            if (me.direction == 'S') {
              action = 'T'
              break;
            } else if (me.direction == 'E') {
              action = 'R'
            } else {
              action = 'L'
            }
          } else {                           // target is on North side
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

        // if in the same row and within 3 tiles
        if (current_player.y == me.y && Math.abs(me.x - current_player.x) < 3) {
          potential_target = current_player
          console.log(me)
          console.log(potential_target)
          if (potential_target.x > me.x) {  //target is on East side
            console.log('Target at East')
            if (me.direction == 'E') {
              action = 'T'
              break;
            } else if (me.direction == 'N') {
              action = 'R'
            } else {
              action = 'L'
            }
          } else {                           //target is on West side
            console.log('Target at West')
            if (me.direction == 'W') {
              action = 'T'
              break;
            } else if (me.direction == 'S') {
              action = 'R'
            } else {
              action = 'L'
            }
          }
        }
      }
    }
  }

  const move = ['F', 'F', 'F', 'F', 'L', 'L', 'L', 'R', 'R', 'R'];
  if (!action)
    action = move[Math.floor(Math.random() * move.length)];

  console.log(action)
  res.send(action);
});

app.listen(process.env.PORT || 8080);
