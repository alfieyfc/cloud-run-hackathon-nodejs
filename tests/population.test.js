const Population = require('../model/population')

var population = Population.random()

describe('Population', () => {
  it('Should have size between 10 and 40', () => {
    expect(population.size)
      .toBeGreaterThanOrEqual(10)
    expect(population.size)
      .toBeLessThanOrEqual(40)
  })

  it('Individuals should have length of size', () => {
    expect(population.individuals.length).toEqual(population.size)
  })

  it('Individuals should have length of new size after reproduction', () => {
    for (let i = 0; i < population.individuals.length; i++) {
      population.individuals[i].score = Math.floor(Math.random() * 100)
    }
    population.reproduction()
    expect(population.individuals.length).toEqual(population.size)
  })

  it('Individuals should be new borns after reproduction', () => {
    for (let i = 0; i < population.individuals.length; i++) {
      population.individuals[i].score = Math.floor(Math.random() * 100)
    }
    var oldGen = population.individuals.slice()
    population.reproduction()
    expect(population.individuals).not.toEqual(oldGen)
  })

  it('No individuals share same coordinate', () => {
    for (let i = 0; i < population.individuals.length; i++) {
      var matches = population.individuals.filter(individual => (individual.x === population.individuals[i].x && individual.y === population.individuals[i].y)).length
      expect(matches).toEqual(1)
    }
  })

  it('No individuals share same coordinate after reproduction', () => {
    population.reproduction()
    for (let i = 0; i < population.individuals.length; i++) {
      var matches = population.individuals.filter(individual => (individual.x === population.individuals[i].x && individual.y === population.individuals[i].y)).length
      expect(matches).toEqual(1)
    }
  })

})
