const Individual = require('./individual')

class Population {
  constructor(size, arenaDims, individuals) {
    this.size = size // varies between 10 to 40
    this.arenaDims = arenaDims
    this.individuals = individuals
  }

  static random = () => {
    var size = randomSize()
    var x = Math.floor(Math.random() * 50) + 14
    var y = Math.floor(Math.random() * 50) + 10
    var arenaDims = [x, y]
    return new Population(size, arenaDims, populate(null, size, arenaDims))
  }

  static preset = (arenaDims, elites) => {
    var size = randomSize()
    if (!arenaDims) {
      var x = Math.floor(Math.random() * 50) + 14
      var y = Math.floor(Math.random() * 50) + 10
      arenaDims = [x, y]
    }
    return new Population(size, arenaDims, populate(elites, size, arenaDims))
  }

  reproduction = (elites) => {
    if (!elites) { elites = this.individuals.sort((a, b) => (a.score < b.score) ? 1 : -1).slice(0, 10) }
    this.size = randomSize()
    var nextGeneration = []

    while (nextGeneration.length < this.size) {
      nextGeneration.push(Individual.breed(selection(elites), Math.floor(Math.random() * this.arenaDims[0]), Math.floor(Math.random() * this.arenaDims[1])))
      var i = nextGeneration.length - 1;
      if (Math.random() < 0.1) nextGeneration[i].dna.mutate()
      // console.log(nextGeneration[i].score)

      var matches = nextGeneration.filter(individual => (individual.x === nextGeneration[i].x && individual.y === nextGeneration[i].y)).length
      while (matches > 1) {
        nextGeneration[i].x = Math.floor(Math.random() * this.arenaDims[0])
        nextGeneration[i].y = Math.floor(Math.random() * this.arenaDims[1])
        matches = nextGeneration.filter(individual => (individual.x === nextGeneration[i].x && individual.y === nextGeneration[i].y)).length
      }
    }

    this.individuals = nextGeneration
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
  var base;
  for (let i = 0; i < list.length; i++) {
    if (list[i].score < 0) base = 1
    else base = list[i].score * list[i].score + 1
    sum += base
  }

  for (let i = 0; i < list.length; i++) {
    if (list[i].score < 0) base = 1
    else base = list[i].score * list[i].score + 1
    list[i].prob = base / sum
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

populate = (elites, size, arenaDims) => {
  var individuals = []
  if (elites) {
    individuals = elites
  }
  for (var i = individuals.length; i < size; i++) {
    individuals.push(new Individual(Math.floor(Math.random() * arenaDims[0]), Math.floor(Math.random() * arenaDims[1])))

    var matches = individuals.filter(individual => (individual.x === individuals[i].x && individual.y === individuals[i].y)).length
    while (matches > 1) {
      individuals[i].x = Math.floor(Math.random() * arenaDims[0])
      individuals[i].y = Math.floor(Math.random() * arenaDims[1])
      matches = individuals.filter(individual => (individual.x === individuals[i].x && individual.y === individuals[i].y)).length
    }
  }
  return individuals
}

randomSize = () => {
  return Math.floor(Math.random() * 30) + 16;
}

module.exports = Population;
