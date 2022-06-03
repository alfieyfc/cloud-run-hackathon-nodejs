const util = require('../util')

describe('topPlayerState(state)', () => {

  it('Returns myself when only 1 player', () => {
    const state = {
      "https://foo.com": {
        "x": 0,
        "y": 0,
        "direction": "N",
        "wasHit": false,
        "score": 0
      }
    }
    const topPlayer = {
      "x": 0,
      "y": 0,
      "direction": "N",
      "wasHit": false,
      "score": 0
    }
    expect(util.topPlayerState(state)).toEqual(topPlayer)
  })

  it('Returns player with top score between 2', () => {
    const state = {
      "https://foo.com": {
        "x": 0,
        "y": 0,
        "direction": "N",
        "wasHit": false,
        "score": 0
      },
      "https://bar.com": {
        "x": 1,
        "y": 1,
        "direction": "N",
        "wasHit": false,
        "score": 2
      }
    }
    const topPlayer = {
      "x": 1,
      "y": 1,
      "direction": "N",
      "wasHit": false,
      "score": 2
    }
    expect(util.topPlayerState(state)).toEqual(topPlayer)
  })

  it('Returns player with top score among 3', () => {
    const state = {
      "https://foo.com": {
        "x": 0,
        "y": 0,
        "direction": "N",
        "wasHit": false,
        "score": 0
      },
      "https://foobar.com": {
        "x": 2,
        "y": 2,
        "direction": "N",
        "wasHit": false,
        "score": 4
      },
      "https://bar.com": {
        "x": 1,
        "y": 1,
        "direction": "N",
        "wasHit": false,
        "score": 2
      }
    }
    const topPlayer = {
      "x": 2,
      "y": 2,
      "direction": "N",
      "wasHit": false,
      "score": 4
    }
    expect(util.topPlayerState(state)).toEqual(topPlayer)
  })

  it('Returns player with top score among 4', () => {
    const state = {
      "https://foo.com": {
        "x": 0,
        "y": 0,
        "direction": "N",
        "wasHit": false,
        "score": 0
      },
      "https://foobar.com": {
        "x": 2,
        "y": 2,
        "direction": "N",
        "wasHit": false,
        "score": 4
      },
      "https://teafoobar.com": {
        "x": 14,
        "y": 2,
        "direction": "W",
        "wasHit": false,
        "score": 14
      },
      "https://bar.com": {
        "x": 1,
        "y": 1,
        "direction": "N",
        "wasHit": false,
        "score": 2
      }
    }
    const topPlayer = {
      "x": 14,
      "y": 2,
      "direction": "W",
      "wasHit": false,
      "score": 14
    }
    expect(util.topPlayerState(state)).toEqual(topPlayer)
  })
})

describe('closestPlayer(state, me, myUrl)', () => {

  it('Returns myself when only 1 player', () => {
    const state = {
      "https://foo.com": {
        "x": 0,
        "y": 0,
        "direction": "N",
        "wasHit": false,
        "score": 0
      }
    }
    const me = {
      "x": 0,
      "y": 0,
      "direction": "N",
      "wasHit": false,
      "score": 0
    }
    const closestPlayer = {
      "x": 0,
      "y": 0,
      "direction": "N",
      "wasHit": false,
      "score": 0
    }
    expect(util.closestPlayerState(state, me, "https://foo.com")).toEqual(closestPlayer)
  })

  it('Returns the other player when only 2 players', () => {
    const state = {
      "https://foo.com": {
        "x": 0,
        "y": 0,
        "direction": "N",
        "wasHit": false,
        "score": 0
      },
      "https://bar.com": {
        "x": 1,
        "y": 1,
        "direction": "N",
        "wasHit": false,
        "score": 2
      }
    }
    const me = {
      "x": 0,
      "y": 0,
      "direction": "N",
      "wasHit": false,
      "score": 0
    }
    const closestPlayer = {
      "x": 1,
      "y": 1,
      "direction": "N",
      "wasHit": false,
      "score": 2
    }
    expect(util.closestPlayerState(state, me, "https://foo.com")).toEqual(closestPlayer)
  })

  it('Returns the closest player with 3 players', () => {
    const state = {
      "https://foo.com": {
        "x": 0,
        "y": 0,
        "direction": "N",
        "wasHit": false,
        "score": 0
      },
      "https://bar.com": {
        "x": 1,
        "y": 1,
        "direction": "N",
        "wasHit": false,
        "score": 2
      },
      "https://foobar.com": {
        "x": 10,
        "y": 1,
        "direction": "N",
        "wasHit": false,
        "score": 2
      }
    }
    const me = {
      "x": 0,
      "y": 0,
      "direction": "N",
      "wasHit": false,
      "score": 0
    }
    const closestPlayer = {
      "x": 1,
      "y": 1,
      "direction": "N",
      "wasHit": false,
      "score": 2
    }
    expect(util.closestPlayerState(state, me, "https://foo.com")).toEqual(closestPlayer)
  })

  it('Returns the closest player with 4 players', () => {
    const state = {
      "https://foo.com": {
        "x": 0,
        "y": 0,
        "direction": "N",
        "wasHit": false,
        "score": 0
      },
      "https://bar.com": {
        "x": 1,
        "y": 1,
        "direction": "N",
        "wasHit": false,
        "score": 2
      },
      "https://foobar.com": {
        "x": 10,
        "y": 1,
        "direction": "N",
        "wasHit": false,
        "score": 2
      },
      "https://teafoobar.com": {
        "x": 0,
        "y": 1,
        "direction": "N",
        "wasHit": false,
        "score": 2
      }
    }
    const me = {
      "x": 0,
      "y": 0,
      "direction": "N",
      "wasHit": false,
      "score": 0
    }
    const closestPlayer = {
      "x": 0,
      "y": 1,
      "direction": "N",
      "wasHit": false,
      "score": 2
    }
    expect(util.closestPlayerState(state, me, "https://foo.com")).toEqual(closestPlayer)
  })
})
