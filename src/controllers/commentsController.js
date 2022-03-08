/* eslint-disable prettier/prettier */
const service = require('../services/index')
const route = require('../api/routes')

module.exports = async function(repo, isoString) {
  let responses = []
  let users = []
  let uniq = []

  try {
    // Fetch comments from the repo
    let [comments] = await Promise.all([
      service.comments(repo + route.comments, isoString)
    ]).catch((e) => {
      console.error(e)
    })

    // If callbacks are not empty,
    // add their comments
    if (comments.length) {
      responses.push(comments)
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
}