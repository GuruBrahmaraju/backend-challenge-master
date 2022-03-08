const apiBase = 'https://api.github.com'

const axios = require('axios')
const config = require('../config')
const http = axios.create({
  baseURL: apiBase,
  headers: {
    Authorization: `token ${config.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})

module.exports = async function (repo) {
  try {
    const response = await http.get(`/${repo}/comments`)
    return response.json
  } catch (e) {
    console.error(e)
    console.dir(e.response.data, { colors: true, depth: 4 })
  }
}
