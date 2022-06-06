const Population = require("./population");
const util = require("../util")

require('dotenv').config();
const epoch = process.env.TRAINING_EPOCH | 20;

class Train {
  constructor() {
    this.epoch = epoch
    this.arenaDims = [14, 10]
    this.population
  }

  start = (preset) => {
    if (preset) {
      this.arenaDims = preset.arenaDims
      this.population = Population.preset(preset.arenaDims, preset.elites)
    } else {
      this.population = Population.random()
    }
    let array = this.population.individuals
    for (var i = 0; i < 1; i++) {
      // TODO: 30 actions, then nextGen
      for (var a = 0; a < 1; a++) {
        for (let index = 0; index < array.length; index++) {
          array[index].score = Math.floor(Math.random() * 100)
        }
        for (var index = 0; index < 1; index++) {
          var me = array[index]
          var topPlayerScore = Math.max(...array.map(o => o.score))
          var topPlayer = array.find(o => o.score == topPlayerScore)
          var closestPlayer
          var closestPlayerDist
          for (var j = 0; j < array.length; j++) {
            if (!closestPlayer || array[j].name != me.name) {
              let player = array[j]
              let dist = Math.sqrt(Math.pow(player.x - me.x, 2) + Math.pow(player.y - me.y, 2))
              if (!closestPlayerDist || closestPlayerDist > dist) {
                closestPlayer = player
                closestPlayerDist = dist
              }
            }
          }
					// TODO: map numeric value to *.wasHit and *.direction
					input = [this.arenaDims[0], 
									 this.arenaDims[1],
									 array.length,
									 me.x,
									 me.y,
									 me.score,
									 me.direction,
									 me.wasHit,
									 topPlayer.x,
									 topPlayer.y,
									 topPlayer.score,
									 topPlayer.direction,
									 topPlayer.wasHit,
									 closestPlayer.x,
									 closestPlayer.y,
									 closestPlayer.score,
									 closestPlayer.direction,
									 closestPlayer.wasHit
									]
        }
      }
      // TODO: 300 actions, then nextGen
      // TODO: 600 actions. Print top 10 elites with scores if end of epochs, otherwise nextGen
    }
  }
}

module.exports = Train;
