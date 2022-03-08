const argv = require('yargs').argv
const chalk = require('chalk')
const config = require('./config')
const index = require('./controllers/commentsController')

const repo = argv.repo
const period = argv.period

console.log(chalk.yellow(`fetch github repository ${repo} comments :`))
console.info(chalk.yellow(config.GITHUB_PERSONAL_ACCESS_TOKEN))

// validate the repository and period of time !
if (typeof repo === 'string') {
  let days = 0

  if (typeof period && period.includes('d')) {
    days = period.replace(/([d])/g, '')
  }

  // print the message
  let message = `Fetching comments for ${days} days for "${repo}"...`
  console.log(message)
  index(repo)
} else {
  console.error('\nInvalid repo, please try again')
}
