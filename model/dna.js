require('dotenv').config();
const pHeight = process.env.P_HEIGHT;
const wILLength = 18 * pHeight;
const wLOLength = pHeight * 4;

class DNA {

  constructor(wIL, wLO) {
    this.wIL = wIL;
    this.wLO = wLO;
  }

  static randomDNA () {
    var wIL = [];
    for (let i = 0; i < wILLength; i++) {
      wIL.push(Math.random())
    }
    var wLO = [];
    for (let i = 0; i < wLOLength; i++) {
      wLO.push(Math.random())
    }
    return new DNA(wIL, wLO);
  }

  static mix (dna_1, dna_2) {
    var wIL = []
    var wLO = []
    for (let i = 0; i < wILLength; i++) {
      if (Math.random() >= 0.5) wIL.push(dna_1.wIL[i])
      else wIL.push(dna_2.wIL[i])
    }
    for (let i = 0; i < wLOLength; i++) {
      if (Math.random() >= 0.5) wLO.push(dna_1.wLO[i])
      else wLO.push(dna_2.wLO[i])
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
