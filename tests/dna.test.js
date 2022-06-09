require('dotenv').config();
const DNA = require('../model/dna')

const pHeight = process.env.P_HEIGHT | 10;
const dna = DNA.randomDNA()
// console.log(dna)

it(`wIL should have 18 * ${pHeight} random values`, () => {
  expect(dna.wIL[0].length).toEqual(pHeight)
  expect(dna.wIL.length).toEqual(18)
  expect(dna.wLO[0].length).toEqual(4)
  expect(dna.wLO.length).toEqual(pHeight)
})

it('mutate(0.1) should change wLO', () => {
  new_dna = DNA.clone(dna)
  new_dna.mutate(0.1)
  expect(new_dna.wLO).not.toEqual(dna.wLO)
  expect(new_dna.wIL).toEqual(dna.wIL)
})

it('mutate(0.6) should change wIL', () => {
  new_dna = DNA.clone(dna)
  new_dna.mutate(0.6)
  expect(new_dna.wIL).not.toEqual(dna.wIL)
  expect(new_dna.wLO).toEqual(dna.wLO)
})

it('mutate() should make a difference', () => {
  new_dna = DNA.clone(dna)
  new_dna.mutate()
  expect(new_dna).not.toEqual(dna)
})

it('mix() should make a living DNA', () => {
  second_dna = DNA.randomDNA()
  expect(typeof DNA.mix(dna, second_dna)).toEqual(typeof dna)
})

it('mix() should not result same as parent', () => {
  second_dna = DNA.randomDNA()
  mixed_dna = DNA.mix(dna, second_dna)
  expect(mixed_dna).not.toEqual(dna)
  expect(mixed_dna).not.toEqual(second_dna)
})

