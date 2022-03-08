/* eslint-disable prettier/prettier */
const get = require('../controllers/getController')
const service = {}

service.comments = async function(route, since) {
  let logins = []
  let firstLogins = []
  const date = new Date(since)

  try {
    const json = await get(route)

    // If we have a response
    if (json.statusText === 'OK') {
   
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

      console.log(logins, 'logins')
    }

  } catch (e) {
    console.error(e)
    console.dir(e.response.data, { colors: true, depth: 4 })
  }
}

module.exports = service