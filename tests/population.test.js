const Population = require('../model/population')

var population = new Population()

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

  it('Parents should not be the same person', ()=> {
    
  })
})
