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
const cellsLength = 140;
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
        this.population.individuals.splice(-6)
        // Next Generation
        this.population.reproduction();

        array = this.population.individuals

        // Always add a control
        array[array.length - 1].name = "control1"
        array[array.length - 2].name = "control2"
        array[array.length - 3].name = "control3"
        array[array.length - 4].name = "control4"
        array[array.length - 5].name = "control5"
        // Always add a monkey
        array[array.length - 6].name = "monkey"

        console.log(`\n--- Epoch ${epoch} Gen ${g} :Take 600 actions: | Population: ${this.population.size} --- (${epoch_total - epoch} epochs to go; ${epoch / epoch_total * 100}% completed)...`)
        for (var a = 0; a < 600; a++) {

          // Get players score in each cell
          var cells = Array(cellsLength).fill(0)
          for (var o = 0; o < array.length; o++) {
            var i = array[o].x + array[o].y * this.arenaDims[0]
            cells[i] = array[o].score
            if (cells[i] == 0) cells[i]++
          }
          // Decide action for each player other than control and monkey
          for (var index = 0; index < array.length - 6; index++) {

            var me = array[index]

            var input = Array(cellsLength + 6)
            input[0] = this.arenaDims[0]
            input[1] = this.arenaDims[1]
            input[2] = me.x
            input[3] = me.y
            input[4] = directions.indexOf(me.direction)
            input[5] = Number(me.wasHit)
            for (var i = 6; i < input.length; i++) {
              input[i] = cells[i - 6]
            }

            var output = math.multiply(math.multiply(input, me.dna.wIL), me.dna.wLO)

            var output_2 = output.map((e) => { return Math.pow(e, 2) })
            // console.log(output_3)
            var sum = output_2.reduce((a, b) => { return a + b })
            // console.log(sum)
            var prob = output_2.map((e) => { return e / sum })

            // Map max(output) to move[]
            me.action = moves[prob.indexOf(Math.max(...prob))]
          }

          // Deside action for control
          array[array.length - 1].action = controlAction("control1", array, this.arenaDims)
          array[array.length - 2].action = controlAction("control2", array, this.arenaDims)
          array[array.length - 3].action = controlAction("control3", array, this.arenaDims)
          array[array.length - 4].action = controlAction("control4", array, this.arenaDims)
          array[array.length - 5].action = controlAction("control5", array, this.arenaDims)
          // Deside action for monkey
          array[array.length - 6].action = randomMove()

          // Results of all decisions made
          for (let index = 0; index < array.length; index++) {
            switch (array[index].action) {
              case 'F':
                // Update x,y for each player that acted 'F'
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
                break;
              case 'R':
                // Update direction for each player that acted 'R'
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
                break;
              case 'L':
                // Update direction for each player that acted 'L'
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
                break;
              case 'T':
                var victim;
                // Update score and wasHit for each player
                switch (array[index].direction) {
                  case 'N':
                    for (var d = 1; d <= 3; d++) {
                      victim = array.find(o => (o.y == array[index].y - d))
                      if (victim) {
                        // console.log(`${array[index].name} hits ${victim.name}`)
                        victim.wasHit = true;
                        array[index].score++;
                        victim.score--;
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
                        victim.score--;
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
                        victim.score--;
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
                        victim.score--;
                        break;
                      }
                    }
                    break;
                }
                break;
              default:
                break;
            }
          }
        }

        // Monitoring the training progress
        var sorted = array.slice().sort((a, b) => (a.score < b.score) ? 1 : -1)
        var lead = sorted[0]
        while (lead.name.indexOf("control") !== -1 || lead.name == "monkey") { lead = sorted[sorted.indexOf(lead) + 1] }
        var last = sorted[sorted.length - 1]
        while (last.name.indexOf("control") !== -1 || last.name == "monkey") { last = sorted[sorted.indexOf(last) - 1] }
        var controls = array.filter(o => (o.name.indexOf("control") !== -1))
        controls.sort((a, b) => (a.score < b.score) ? 1 : -1)
        var monkey = array.find(o => (o.name == "monkey"))

        // Sort the monitored players (lead, last, top control, monkey)
        var mon = [lead, last, controls[0], monkey].sort((a, b) => (a.score < b.score) ? 1 : -1)
        mon.forEach((e) => {
          if (mon.indexOf(e) == 0) {
            if (e.name.indexOf("control") !== -1 || e.name == "monkey") {
              failed_count++;
              console.log(`${e.name} scored ${e.score}`.red)
              // Revert generation
              this.population.individuals = previous_gen
            }
            else console.log(`${e.name} scored ${e.score}`.green)
          } else if (mon.indexOf(e) == 3) {
            if (e.name.indexOf("control") !== -1 || e.name == "monkey") console.log(`${e.name} scored ${e.score}`.green)
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
      previous_failed_count = failed_count
    }
    stream.write(`${failed_count}\n`)
    stream.end();

    console.log(`\nEpochs: ${epoch}, Generations ${g * epoch} --- Top 10 in Final Generation ---`)
    var finalElites = array.slice()
    finalElites.splice(-6)
    finalElites = finalElites.sort((a, b) => (a.score < b.score) ? 1 : -1).slice(0, 10)
    for (let index = 0; index < finalElites.length; index++) {
      console.log(`${finalElites[index].name} scored ${finalElites[index].score}`)
    }

    const finalJson = {
      "arenaDims": this.arenaDims,
      "elites": finalElites
    }

    const data = JSON.stringify(finalJson)

    fs.writeFile('model/trained-elites2.json', data, (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.")
    })
  }

}



module.exports = Train;

randomMove = () => {
  return moves[Math.floor(Math.random() * moves.length)]
}

controlAction = (name, array, dims) => {
  // control is always at [length-1]
  var action = randomMove()
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
    for (var i = 0; i < array.length; i++) {
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
          } else {                          // target is on North side
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
