const github = require('../services/index')
const config = require('../config')

const commnetsController = {
  async getCommnets(repo, isoString) {
    let responses = []
    let users = []
    let uniq = []

    let since = '&since=' + isoString
    since += '&sort=created&direction=desc'

    try {
      // Fetch all apis asynchronously
      let [comments, issues, pulls, stats] = await Promise.all([
        github.comments(repo + config.comments, isoString),
        github.since(repo + config.issues + since),
        github.since(repo + config.pulls + since),
        github.stats(repo + config.stats),
      ]).catch((e) => {
        console.error(e)
      })

      // if the callback is not empty then we are wrapping the data.
      if (comments.length) {
        responses.push(comments)
      }
      if (issues.length) {
        responses.push(issues)
      }
      if (pulls.length) {
        responses.push(pulls)
      }

      if (stats.length) {
        await responses.push(stats)
      }

      // Add pages of array objects to one uniform array
      await responses.map((response) => {
        response.map((data) => {
          users.push(data)
        })
      })
      await users.map((user) => {
        if (!uniq.includes(user.login)) {
          uniq.push(user.login)
        }
      })

      // Return combined user data
      await uniq.map((login, i) => {
        users.map((user) => {
          // Set first loop values
          let comments = 0
          let total = 0

          if (login === user.login) {
            // Update value if properties exist
            if (uniq[i].comments) {
              comments = uniq[i].comments
            }

            if (uniq[i].total) {
              total = uniq[i].total
            }

            // Return an object in custom mapped array
            uniq[i] = {
              login: login,
              comments: (comments += user.comments),
              total: (total += user.total),
            }

            return uniq[i]
          }
        })
      })

      // Sort by Comments
      let sortedUsers = await uniq.sort((a, b) => b.comments - a.comments)

      return sortedUsers
    } catch (e) {
      console.error(e)
      console.dir(e.response.data, { colors: true, depth: 4 })
    }
  },
}

module.exports = commnetsController
