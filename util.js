const { move } = require("./web");

const moves = ['T', 'F', 'R', 'L'];

module.exports = {
  topPlayerState: (state) => {
    let topPlayer;

    for (key in state) {
      if (!topPlayer || topPlayer.score < state[key].score) {
        topPlayer = state[key]
      }
    }
    return topPlayer
  },
  closestPlayerState: (state, me, myUrl) => {
    let closestPlayer;
    let closestPlayerDist;

    for (key in state) {
      if (!closestPlayer || key != myUrl) {
        player = state[key]
        dist = Math.sqrt(Math.pow(player.x - me.x, 2) + Math.pow(player.y - me.y, 2))
        if (!closestPlayerDist || closestPlayerDist > dist) {
          closestPlayer = player
          closestPlayerDist = dist
        }
      }
    }
    return closestPlayer
  },
  numPlayers: (state) => {
    return Object.keys(state).length
  },
  pickOne: (probability_array) => {
    var index = 0;
    var r = Math.random()

    while (r > 0) {
      r = r - probability_array[index]
      index++
    }
    index--
    return probability_array[index]
  },
  controlAction: (name, array, dims) => {
    // control is always at [length-1]
    var action = moves[Math.floor(Math.random() * moves.length)]
    var me = array.find(o => o.name == name)
    if (me.wasHit) {
      action = 'F'
      switch (me.direction) {
        case 'E':
          if (me.x == dims[0] - 1) {
            action = 'R'
            break;
          }
          for (var i = 0; i < array.length - 1; i++) {
            if (array[i].y == me.y && array[i].x - me.x == 1) {
              action = 'R'
              break;
            }
          }
          break;
        case 'W':
          if (me.x == 0) {
            action = 'R'
            break;
          }
          for (var i = 0; i < array.length - 1; i++) {
            if (array[i].y == me.y && array[i].x - me.x == -1) {
              action = 'R'
              break;
            }
          }
          break;
        case 'S':
          if (me.y == dims[1] - 1) {
            action = 'R'
            break;
          }
          for (var i = 0; i < array.length - 1; i++) {
            if (array[i].x == me.x && array[i].y - me.y == 1) {
              action = 'R'
              break;
            }
          }
          break;
        case 'N':
          if (me.y == 0) {
            action = 'R'
            break;
          }
          for (var i = 0; i < array.length - 1; i++) {
            if (array[i].x == me.x && array[i].y - me.y == -1) {
              action = 'R'
              break;
            }
          }
          break;
      }
    } else {
      for (var i = 0; i < array.length - 1; i++) {
        current_player = array[i]
        if (current_player.name != me.name) {
          // if in the same col and within 3 tiles
          if (current_player.x == me.x && Math.abs(me.y - current_player.y) <= 3) {
            potential_target = current_player;
            if (potential_target.y > me.y) { // target is on South side
              if (me.direction == 'S') {
                action = 'T'
                break;
              } else if (me.direction == 'E') {
                action = 'R'
              } else {
                action = 'L'
              }
            } else {                           // target is on North side
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
          if (current_player.y == me.y && Math.abs(me.x - current_player.x) <= 3) {
            potential_target = current_player
            if (potential_target.x > me.x) {  //target is on East side
              if (me.direction == 'E') {
                action = 'T'
                break;
              } else if (me.direction == 'N') {
                action = 'R'
              } else {
                action = 'L'
              }
            } else {                           //target is on West side
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

    return action
  }
}

