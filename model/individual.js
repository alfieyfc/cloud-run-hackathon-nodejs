const DNA = require('./dna')
const { v4: uuidv4 } = require('uuid');

class Individual {
  constructor(x, y) {
    this.name = uuidv4();
    this.score = 0;
    this.prob = 0;
    this.dna = DNA.randomDNA();
    this.x = x;
    this.y = y;
    this.direction = getRandomDirection();
    this.wasHit = false;
    this.action = null;
  }

  updateScore = (score) => {
    this.score = score
  }

  static breed = (parents, x, y) => {
    var newBorn = new Individual(x, y)
    var newDNA = DNA.mix(parents[0].dna, parents[1].dna)
    newBorn.dna = newDNA
    return newBorn
  }

  decideAction = (input) => {

  }
}

getRandomDirection = () => {
  const directions = ['N', 'S', 'E', 'W'];
  action = directions[Math.floor(Math.random() * directions.length)];
  return action;
}

module.exports = Individual;
