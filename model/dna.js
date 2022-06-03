require('dotenv').config();
const pHeight = process.env.P_HEIGHT | 10;
const wILWidth = 18;
const wILHeight = pHeight;
const wLOWidth = pHeight;
const wLOHeight = 4;

class DNA {

  constructor(wIL, wLO) {
    this.wIL = wIL;
    this.wLO = wLO;
  }

  static randomDNA () {
    var wIL = Array(wILHeight).fill(Array(wILWidth).fill(Math.random()));
    var wLO = Array(wLOHeight).fill(Array(wLOWidth).fill(Math.random()));
    return new DNA(wIL, wLO);
  }

  static mix (dna_1, dna_2) {
    var wIL = new Array(wILHeight).fill(Array(wILWidth).fill(Math.random()));
    var wLO = new Array(wLOHeight).fill(Array(wLOWidth).fill(Math.random()));
    for (let i = 0; i < wILHeight; i++) {
      for (let j = 0; j < wILWidth; j++) {
        if (Math.random() >= 0.5) wIL[i][j] = dna_1.wIL[i][j]
        else wIL[i][j] = dna_2.wIL[i][j]
      }
    }
    for (let i = 0; i < wLOHeight; i++) {
      for (let j = 0; j < wLOWidth; j++) {
        if (Math.random() >= 0.5) wLO[i][j] = dna_1.wLO[i][j]
        else wLO[i][j] = dna_2.wLO[i][j]
      }
    }
    return new DNA(wIL, wLO)
  }

  static clone (dna) {
    let wIL = dna.wIL.slice()
    let wLO = dna.wLO.slice()
    return new DNA(wIL, wLO)
  }

  mutate = (set) => {
    if (!set) set = Math.random()

    if (set >= 0.5) mutateSegment(this.wIL)
    else mutateSegment(this.wLO)
  }
}

mutateSegment = (s) => {
  let e = Math.floor(Math.random() * s.length)
  let c = s[e]
  while (c == s[e]) {
    c = Math.random()
  }
  s[e] = c
}

module.exports = DNA;
