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
  }
}
