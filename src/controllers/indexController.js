/* eslint-disable prettier/prettier */
const comments = require('./commentsController')

module.exports = async function (repo, isoString) {
  // Fetch Comments
  const users = await comments(repo, isoString)
  // Print Benchmarks & Report
  // Log empty lines for readability
  console.log('')
  console.log('')

  users.map((user) => {
    let comments = user.comments.toString()
    let login = user.login
    let commits = user.total

    console.log(`${comments}  comments, ${login}  (${commits} commits)`)
  })
}
