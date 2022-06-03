const Individual = require("../model/individual");

const individual = new Individual

describe('Individual', () => {
  it('updateScore() should update score', () => {
    const score = Math.floor(Math.random * 100)
    individual.updateScore(score)
    expect(individual.score).toEqual(score)
  })

  it('breed() should have a new baby', () => {
    const parentA = new Individual
    const parentB = new Individual
    const baby = Individual.breed([parentA, parentB])
    expect(baby).not.toEqual(parentA)
    expect(baby).not.toEqual(parentB)
    expect(typeof baby).toEqual(typeof parentA)
  })
})
