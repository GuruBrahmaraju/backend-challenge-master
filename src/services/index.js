const getController = require('../controllers/getController')
const commentService = require('./commentService')
const fetchService = require('./fetchService')

const github = {
  async comments(route, since) {
    let logins = []
    let comments = []
    let firstLogins = []
    let remainingLogins = []
    const date = new Date(since)

    try {
      const json = await getController.readLocalFile(route)

      // If we have a response from github
      if (json.statusText === 'OK') {
        const headers = json.headers

        // Fetch last page and reverse
        remainingLogins = await fetchService.getPageDetails(
          headers,
          'continuous',
          date,
        )
        // Add results to logins array
        if (remainingLogins) {
          logins = [...remainingLogins]
        }

        // Filter first request by Date/Time
        await json.data.map((stats) => {
          let fetchDate = new Date(stats.created_at)
          if (fetchDate > date) {
            if (stats.user['login']) {
              firstLogins.push(stats.user['login'])
            }
          }
        })

        // Merge all logins into array
        logins = [...logins, ...firstLogins]

        // Count how many logins in array as a comment
        comments = await commentService.fetchComments(logins)
      }

      return comments
    } catch (e) {
      console.error(e)
      console.dir(e.response.data, { colors: true, depth: 4 })
    }
  },

  async since(route) {
    let logins = []
    let comments = []
    let firstLogins = []
    let remainingLogins = []

    try {
      const json = await getController.readLocalFile(route)
      // If we have a response from github
      if (json.statusText === 'OK') {
        const headers = json.headers

        // Fetch last page and reverse
        remainingLogins = await fetchService.getPageDetails(
          headers,
          'since',
          false,
        )

        // Add results to logins array
        if (remainingLogins) {
          logins = [...remainingLogins]
        }

        await json.data.map((stats) => {
          if (stats.user['login']) {
            firstLogins.push(stats.user['login'])
          }
        })

        // Merge all logins into one array
        logins = [...logins, ...firstLogins]

        // Count how many logins in array as a comment
        comments = await commentService.fetchComments(logins)
      }

      return comments
    } catch (e) {
      console.error(e)
      console.dir(e.response.data, { colors: true, depth: 4 })
    }
  },

  async stats(route) {
    const totals = []

    try {
      const json = await getController.readLocalFile(route)

      // If we have a response
      if (json.statusText === 'OK') {
        // Create JSON schema template
        await json.data.map((stats) => {
          if (stats.author['login']) {
            totals.push({
              login: stats.author['login'],
              comments: 0,
              total: stats.total,
            })
          }
        })
      }

      return totals
    } catch (e) {
      console.error(e)
      console.dir(e.response.data, { colors: true, depth: 4 })
    }
  },
}

module.exports = github
