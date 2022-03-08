const commnetsController = require('./commentsController')

const indexController = {
  async fetchUsers(repo, isoString) {
    // Fetch Comments
    const users = await commnetsController.getCommnets(repo, isoString)

    // format the usersdata to in a print at CLI
    users.map((user) => {
      let comments = user.comments.toString()
      let login = user.login
      let commits = user.total

      console.log(`${comments}  comments, ${login}  (${commits} commits)`)
    })
  },
}

module.exports = indexController
