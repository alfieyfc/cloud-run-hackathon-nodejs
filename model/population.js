const Individual = require('./individual')

class Population {
  constructor() {
    this.size = randomSize() // varies between 10 to 40
    this.individuals = populate(this.size)
  }

  reproduction = () => {

    var elites = this.individuals.sort((a, b) => (a.score < b.score) ? 1 : -1).slice(0, 10)
    this.changeSize
    var nextGeneration = []

    while (nextGeneration.length < this.size) {
      nextGeneration.push(Individual.breed(selection(elites)))
    }
  }
}

selection = (elites) => {
  var list = elites.slice()
  var parentA = pickOne(list)
  var parentB = pickOne(list)

  return [parentA, parentB]
}

pickOne = (list) => {
  var sum = 0
  for (let i = 0; i < list.length; i++) {
    sum += list[i].score
  }

  for (let i = 0; i < list.length; i++) {
    list[i].prob = list[i].score / sum
  }

  var index = 0;
  var r = Math.random()

  while (r > 0) {
    r = r - list[index].prob
    index++
  }
  index--
  var result = list[index]
  list.splice(index, 1)
  return result
}

changeSize = () => {
  this.size = randomSize()
}

populate = (size) => {
  var individuals = []
  for (let i = 0; i < size; i++) {
    individuals.push(new Individual())
  }
  return individuals
}

randomSize = () => {
  return Math.floor(Math.random() * 30) + 10;
}

module.exports = Population;
