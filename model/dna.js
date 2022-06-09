require('dotenv').config();
const pHeight = process.env.P_HEIGHT || 10;
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
    var wIL = Array.from({ length: wILHeight }, () => { return Array.from({ length: wILWidth }, () => { return Math.random() }) });
    var wLO = Array.from({ length: wLOHeight }, () => { return Array.from({ length: wLOWidth }, () => { return Math.random() }) });
    return new DNA(wIL, wLO);
  }

  static mix (dna_1, dna_2) {
    var wIL = Array.from({ length: wILHeight }, () => { return Array.from({ length: wILWidth }, () => { return 0 }) });
    var wLO = Array.from({ length: wLOHeight }, () => { return Array.from({ length: wLOWidth }, () => { return 0 }) });
    for (let i = 0; i < wILHeight; i++) {
      for (let j = 0; j < wILWidth; j++) {
        if (Math.random() >= 0.5) {
          // console.log(`wIL at (${i}, ${j}) from dna1 ${dna_1.wIL[i][j]}`)
          wIL[i][j] = dna_1.wIL[i][j]
        }
        else {
          // console.log(`wIL at (${i}, ${j}) from dna2 ${dna_2.wIL[i][j]}`)
          wIL[i][j] = dna_2.wIL[i][j]
        }
      }
    }
    for (let i = 0; i < wLOHeight; i++) {
      for (let j = 0; j < wLOWidth; j++) {
        if (Math.random() >= 0.5) {
          // console.log(`wLO at (${i}, ${j}) from dna1 ${dna_1.wLO[i][j]}`)
          wLO[i][j] = dna_1.wLO[i][j]
        }
        else {
          // console.log(`wLO at (${i}, ${j}) from dna2 ${dna_2.wLO[i][j]}`)
          wLO[i][j] = dna_2.wLO[i][j]
        }
      }
    }
    var dna3 = new DNA(wIL, wLO)
    // console.log(dna3)
    return dna3
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
