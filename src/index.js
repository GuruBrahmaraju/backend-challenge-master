/* eslint-disable radix */
const argv = require('yargs').argv
const chalk = require('chalk')
const config = require('./config')
@@ -16,11 +17,21 @@ if (typeof repo === 'string') {
  if (typeof period && period.includes('d')) {
    days = period.replace(/([d])/g, '')
  }
  // convert "days" to number
  const time = parseInt(days, 0)
  let isoString = ''

  // convert time to ISO 8601 format
  if (time !== 0) {
    let date = new Date()
    date.setDate(date.getDate() - time)
    isoString = date.toISOString().replace(/(\..*)/g, 'Z')
  }

  // print the message
  let message = `Fetching comments for ${days} days for "${repo}"...`
  console.log(message)
  index(repo)
  index(repo, isoString)
} else {
  console.error('\nInvalid repo, please try again')
}