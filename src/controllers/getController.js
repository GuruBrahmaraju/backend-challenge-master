/* eslint-disable prettier/prettier */
const axios = require('axios')
const config = require('../config')
const jsonfile = require('jsonfile')
const process = require('process')
// Local JSON file
let file = __dirname.replace(/(\/config)/g, '')
file += '/remaining.json'

// Github API URL
const baseURL = 'https://api.github.com/repos/'

// create HTTPS request
const http = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})

// general purpose "GET"
module.exports = async function(url) {
  try {
    // Quit application if we have no more calls
    jsonfile.readFile(file, function(err, obj) {
      if (obj.remaining === '0') {
        let currentHour = Date.now()
        let hoursFromSave = Math.abs(currentHour - obj.time) / 3600000

        // Before killing app,
        // check our local file if one hour has gone by
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

    // Write new data to local file
    jsonfile.writeFile(file, apiJSON, function(err) {
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
}