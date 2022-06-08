const fs = require('fs');
const stream = fs.createWriteStream('./model/failed_count.txt');

const colors = require('colors');
const math = require('mathjs');
const Population = require("./population");
const util = require("../util")

require('dotenv').config();
const epoch_total = process.env.TRAINING_EPOCH || 20;
const directions = ['N', 'E', 'S', 'W'];
const moves = ['T', 'F', 'R', 'L'];
var previous_failed_count = 0;

class Train {
  constructor() {
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

    var g = 0;
    var array;
    for (var epoch = 0; epoch < epoch_total; epoch++) {

      var failed_count = 0;
      // 100 Generations per epoch
      for (var g = 0; g < 100; g++) {
        var previous_gen = this.population.individuals.slice()
        // Remove control and monkey
        this.population.individuals.splice(-2)
        // Next Generation
        this.population.reproduction();

        array = this.population.individuals

        // Always add a control
        array[array.length - 1].name = "control"
        // Always add a monkey
        array[array.length - 2].name = "monkey"

        console.log(`\n--- Epoch ${epoch} Gen ${g} :Take 600 actions: | Population: ${this.population.size} --- (${epoch_total - epoch} epochs to go; ${epoch / epoch_total * 100}% completed)...`)
        for (var a = 0; a < 600; a++) {

          // Update score for players that were hit (-1)
          for (let index = 0; index < array.length; index++) {
            if (array[index].wasHit)
              array[index].score--
          }

          // Find player with top score
          var topPlayerScore = Math.max(...array.map(o => o.score))
          // console.log(topPlayerScore)
          var topPlayer = array.find(o => o.score == topPlayerScore)

          // Deside action for each player other than control and monkey
          for (var index = 0; index < array.length - 2; index++) {

            var me = array[index]

            // Find player closest to current player (me)
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

            var input = [
              this.arenaDims[0],
              this.arenaDims[1],
              array.length,
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

            var output = math.multiply(math.multiply(input, me.dna.wIL), me.dna.wLO)

            // Map max(output) to move[]
            me.action = moves[output.indexOf(Math.max(...output))]
          }

          // Deside action for control
          array[array.length - 1].action = controlAction(array, this.arenaDims)
          // Deside action for monkey
          array[array.length - 2].action = randomMove()

          // Update x,y for each player that acted 'F'
          for (let index = 0; index < array.length; index++) {
            if (array[index].action === 'F')
              switch (array[index].direction) {
                case 'N':
                  if (array[index].y > 0) array[index].y--;
                  break;
                case 'E':
                  if (array[index].x < this.arenaDims[0] - 1) array[index].x++;
                  break;
                case 'S':
                  if (array[index].y < this.arenaDims[1] - 1) array[index].y++;
                  break;
                case 'W':
                  if (array[index].x > 0) array[index].x--;
                  break;
              }
          }

          // Update direction for each player that acted 'R' or 'L'
          for (let index = 0; index < array.length; index++) {
            if (array[index].action === 'R') {
              switch (array[index].direction) {
                case 'N':
                  array[index].direction = 'E';
                  break;
                case 'E':
                  array[index].direction = 'S';
                  break;
                case 'S':
                  array[index].direction = 'W';
                  break;
                case 'W':
                  array[index].direction = 'N';
                  break;
                default:
                  break;
              }
            } else if (array[index].action === 'L') {
              switch (array[index].direction) {
                case 'N':
                  array[index].direction = 'W';
                  break;
                case 'E':
                  array[index].direction = 'N';
                  break;
                case 'S':
                  array[index].direction = 'E';
                  break;
                case 'W':
                  array[index].direction = 'S';
                  break;
                default:
                  break;
              }
            }
          }

          // Update score and wasHit for each player
          for (let index = 0; index < array.length; index++) {
            var victim;
            if (array[index].action === 'T') {
              switch (array[index].direction) {
                case 'N':
                  for (var d = 1; d <= 3; d++) {
                    victim = array.find(o => (o.y == array[index].y - d))
                    if (victim) {
                      // console.log(`${array[index].name} hits ${victim.name}`)
                      victim.wasHit = true;
                      array[index].score++;
                      break;
                    }
                  }
                  break;
                case 'E':
                  for (var d = 1; d <= 3; d++) {
                    victim = array.find(o => (o.x == array[index].x + d))
                    if (victim) {
                      // console.log(`${array[index].name} hits ${victim.name}`)
                      victim.wasHit = true;
                      array[index].score++;
                      break;
                    }
                  }
                  break;
                case 'S':
                  for (var d = 1; d <= 3; d++) {
                    victim = array.find(o => (o.y == array[index].y + d))
                    if (victim) {
                      // console.log(`${array[index].name} hits ${victim.name}`)
                      victim.wasHit = true;
                      array[index].score++;
                      break;
                    }
                  }
                  break;
                case 'W':
                  for (var d = 1; d <= 3; d++) {
                    victim = array.find(o => (o.y == array[index].x - d))
                    if (victim) {
                      // console.log(`${array[index].name} hits ${victim.name}`)
                      victim.wasHit = true;
                      array[index].score++;
                      break;
                    }
                  }
                  break;
              }
            }
          }
        }

        // Find player with top score
        var sorted = array.slice().sort((a, b) => (a.score < b.score) ? 1 : -1)
        var lead = sorted[0]
        while (lead.name == "control" || lead.name == "monkey") { lead = sorted[sorted.indexOf(lead) + 1] }
        var last = sorted[sorted.length - 1]
        while (last.name == "control" || last.name == "monkey") { last = sorted[sorted.indexOf(last) - 1] }
        var control = array.find(o => (o.name == "control"))
        var monkey = array.find(o => (o.name == "monkey"))
        var mon = [lead, last, control, monkey].sort((a, b) => (a.score < b.score) ? 1 : -1)
        mon.forEach((e) => {
          if (mon.indexOf(e) == 0) {
            if (e.name == "control" || e.name == "monkey") {
              failed_count++;
              console.log(`${e.name} scored ${e.score}`.red)
              // Revert generation
              this.population.individuals = previous_gen
            }
            else console.log(`${e.name} scored ${e.score}`.green)
          } else if (mon.indexOf(e) == 3) {
            if (e.name == "control" || e.name == "monkey") console.log(`${e.name} scored ${e.score}`.green)
            else console.log(`${e.name} scored ${e.score}`.grey)
          } else {
            console.log(`${e.name} scored ${e.score}`)
          }
        })

        if (failed_count > previous_failed_count)
          console.log("Failed to win the game " + `${failed_count}`.red + ` times during this epoch... Previously ${previous_failed_count}`)
        else
          console.log("Failed to win the game " + `${failed_count}`.grey + ` times during this epoch... Previously ${previous_failed_count}`)
      }
      stream.write(`${failed_count}\n`)
      previous_failed_count = failed_count
    }
    stream.end();

    console.log(`\nGeneration ${g - 1}: Top 10`)
    var finalElites = array.slice()
    finalElites.splice(-2)
    finalElites = finalElites.sort((a, b) => (a.score < b.score) ? 1 : -1).slice(0, 10)
    for (let index = 0; index < finalElites.length; index++) {
      console.log(`${finalElites[index].name} scored ${finalElites[index].score}`)
    }

    const finalJson = {
      "arenaDims": this.arenaDims,
      "elites": finalElites
    }

    const data = JSON.stringify(finalJson)

    fs.writeFile('model/trained-elites.json', data, (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.")
    })


    // console.log(`\nGeneration ${g - 1}:`)
    // var finalPopulation = this.population.individuals.sort((a, b) => (a.score < b.score) ? 1 : -1).slice(0, -3)
    // for (let index = 0; index < finalPopulation.length; index++) {
    //   console.log(`${finalPopulation[index].name} scored ${finalPopulation[index].score}`)
    // }
    // console.log(finalPopulation[0].dna)
  }

}


module.exports = Train;

randomMove = () => {
  return moves[Math.floor(Math.random() * moves.length)]
}

controlAction = (array, dims) => {
  // control is always at [length-1]
  var action = randomMove()
  var me = array[array.length - 1]
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
