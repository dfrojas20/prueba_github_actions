// curl -s -H "Accept: application/json" -X POST -d '{"numbers": [1,1,2,3,5]}' POST http://localhost:3000/dev/calcs/add --connect-timeout 30

describe('basics', () => {

it('test add', async () => {
  const axios = require('axios').default
  res = await axios.post('http://localhost:3000/dev/calcs/add', {
    numbers: [1,1,2,3,5],
  })
  expect(res?.data.result).toBe(12)
},6000)
})

