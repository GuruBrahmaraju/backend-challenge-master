const axios = require('axios')
const config = require('../config')
const jsonfile = require('jsonfile')
const process = require('process')
// Local JSON file we are handling github request in one hour handles 5000 requests
let file = __dirname.replace(/(\/controllers)/g, '')
file += '/remaining.json'

// create HTTPS request
const http = axios.create({
  baseURL: config.baseURL,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})

const getController = {
  async readLocalFile(url) {
    try {
      // Quit application if we have no more calls it reads from the JSON file
      jsonfile.readFile(file, (err, obj) => {
        if (obj.remaining === '0') {
          let currentHour = Date.now()
          let hoursFromSave = Math.abs(currentHour - obj.time) / 3600000

          // Before killing application,
          // check our local file if one hour has completed 5000 requests
          if (hoursFromSave < 1) {
            process.exit()
          }
        }

        if (err) {
          console.error(err)
        }
      })

      // Send URL request
      let request = await http.get(url)

      // Format response
      let headers = request.headers
      let limit = headers['x-ratelimit-limit']
      let remaining = headers['x-ratelimit-remaining']
      let time = Date.now()
      let apiJSON = {
        remaining: remaining,
        limit: limit,
        time: time,
      }

      // overWrite the new data to local file
      jsonfile.writeFile(file, apiJSON, (err) => {
        if (err) {
          console.error(err)
        }
      })

      // Return resolved Promise
      return request
    } catch (e) {
      console.error(e)
      console.dir(e.response.data, { colors: true, depth: 4 })
    }
  },
}
module.exports = getController
