require('dotenv').config();
const DNA = require('../model/dna')

const dna = DNA.randomDNA()

it(`wIL should have 18 * ${process.env.P_HEIGHT} random values`, () => {
  const l = 18 * process.env.P_HEIGHT;
  expect(dna.wIL.length).toEqual(l)
})

it(`wLO should have 4 * ${process.env.P_HEIGHT} random values`, () => {
  const l = 4 * process.env.P_HEIGHT;
  expect(dna.wLO.length).toEqual(l)
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

it('mix() should make a living DNA', () => {
  second_dna = DNA.randomDNA()
  mixed_dna = DNA.mix(dna, second_dna)
  expect(mixed_dna.wIL).not.toEqual(dna.wIL)
  expect(mixed_dna.wIL).not.toEqual(second_dna.wIL)
  expect(mixed_dna.wLO).not.toEqual(dna.wLO)
  expect(mixed_dna.wLO).not.toEqual(second_dna.wLO)
})

