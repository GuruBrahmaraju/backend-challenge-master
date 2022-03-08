/* eslint-disable prettier/prettier */
const comments = require('./commentsController')

module.exports = async function(repo, isoString) {
  // Fetch Comments
  const users = await comments(repo, isoString)
  console.log(users)
}