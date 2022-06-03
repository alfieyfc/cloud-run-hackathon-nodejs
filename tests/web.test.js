const request = require('supertest')
const web = require('../web')

describe('GET /', () => {

  it('Let the battle begin!', () => {
    return request(web)
      .get('/')
      .expect(200)
      .then((response) => {
        expect(response.text).toEqual("Let the battle begin!")
      })
  })
})

describe('POST /', () => {
  it('Return any move when only 1 player', () => {
    const data = {
      "_links": {
        "self": {
          "href": "https://foo.com"
        }
      },
      "arena": {
        "dims": [4, 3],
        "state": {
          "https://foo.com": {
            "x": 0,
            "y": 0,
            "direction": "N",
            "wasHit": false,
            "score": 0
          }
        }
      }
    }
    return request(web)
      .post('/')
      .send(data)
      .expect(200)
      .then((response) => {
        expect(['T', 'F', 'R', 'L']).toContain(response.text)
      })
  })
})
