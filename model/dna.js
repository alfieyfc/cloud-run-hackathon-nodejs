require('dotenv').config();
const pHeight = process.env.P_HEIGHT | 10;
const wILHeight = 18;
const wILWidth = pHeight;
const wLOHeight = pHeight;
const wLOWidth = 4;

class DNA {

  constructor(wIL, wLO) {
    this.wIL = wIL;
    this.wLO = wLO;
  }

  static randomDNA () {
    var wIL = Array(wILHeight).fill(Array.from({ length: wILWidth }, () => Math.random()));
    var wLO = Array(wLOHeight).fill(Array.from({ length: wLOWidth }, () => Math.random()));
    return new DNA(wIL, wLO);
  }

  static mix (dna_1, dna_2) {
    var wIL = new Array(wILHeight).fill(Array(wILWidth).fill(0));
    var wLO = new Array(wLOHeight).fill(Array(wLOWidth).fill(0));
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
  if (Math.random() >= 0.5) s[e] = s[e].map((v) => { return v * 1.1 })
  else s[e] = s[e].map((v) => { return v * 0.9 })
}

module.exports = DNA;
