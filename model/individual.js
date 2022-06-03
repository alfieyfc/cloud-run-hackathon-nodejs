const DNA = require('./dna')
class Individual {
  constructor() {
    this.score = 0;
    this.prob = 0;
    this.dna = DNA.randomDNA();
  }

  updateScore = (score) => {
    this.score = score
  }

  static breed = (parents) => {
    var newBorn = new Individual
    var newDNA = DNA.mix(parents[0].dna, parents[1].dna)
    newBorn.dna = newDNA
    // console.log(parents[0].dna.wLO)
    // console.log(parents[1].dna.wLO)
    // console.log(newBorn.dna.wLO)
    return newBorn
  }
}

module.exports = Individual;
