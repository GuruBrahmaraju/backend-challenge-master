/* eslint-disable radix */
const argv = require('yargs').argv
const indexController = require('./src/controllers/indexController')

try {
  // Get the repo and time period from CLI arguments
  const repo = argv.repo
  const period = argv.period

  // validate the repository and period of time !
  if (typeof repo === 'string') {
    let days = 0

    if (typeof period && period.includes('d')) {
      days = period.replace(/([d])/g, '')
    }
    // convert days to number
    const time = parseInt(days, 0)
    let isoString = ''

    // converting the time to ISO format
    if (time !== 0) {
      let date = new Date()
      date.setDate(date.getDate() - time)
      isoString = date.toISOString().replace(/(\..*)/g, 'Z')
    }

    // print the message
    let message = `Fetching comments for ${days} days for "${repo}"...`
    console.log(message)
    indexController.fetchUsers(repo, isoString)
  } else {
    console.error('\nInvalid repo, please try again')
  }
} catch (e) {
  console.error(e)
}
