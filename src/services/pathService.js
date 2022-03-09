/* eslint-disable radix */
const getService = require('./getService')

const pathService = {
  // set next and last pages
  async setPath(next, last, date) {
    let routes = []
    let logins = []
    const regex = new RegExp(/.*(\?page=)|(&per_page=).*/, 'g')
    const nextValue = parseInt(next.replace(regex, ''), 0)
    const lastValue = parseInt(last.replace(regex, ''), 0)
    const diff = lastValue - nextValue

    // Create placeholder route to inject
    // remaining routes in between "next" & "last"
    let url = ''
    let urlBegin = next.replace(/(&per_page=).*/, '')
    let urlEnd = next.replace(/.*(\?page=)/, '')
    let start = urlBegin.slice(0, urlBegin.length - 1)
    let finish = urlEnd.slice(1)

    try {
      // First add routes we know we need
      routes.push(next, last)

      // Inject remaining routes between "next" & "last"
      if (diff > 1) {
        for (let i = nextValue + 1; i < lastValue; i++) {
          url = start + i + finish
          routes.push(url)
        }
      }

      // If supplied a date from /services/index.js
      if (date !== false) {
        let urls = routes.sort().reverse()

        // Fetch every URL simulataneously
        let jsonArray = await Promise.all(
          urls.map((url) => getService.fetchData(url)),
        ).catch((e) => {
          console.error(e)
        })

        // Map to logins array
        jsonArray.map((json) => {
          json.data.map((data) => {
            let fetchDate = new Date(data.created_at)

            // Filter incoming JSON by Date/Time
            if (fetchDate > date && data.user['login']) {
              logins.push(data.user['login'])
            }
          })
        })
      } else {
        // Fetch every URL simulataneously
        let jsonArray = await Promise.all(
          routes.sort().map((route) => getService.fetchData(route)),
        ).catch((e) => {
          console.error(e)
        })
        jsonArray.map((json) => {
          json.data.map((data) => {
            if (data.user['login']) {
              logins.push(data.user['login'])
            }
          })
        })
      }

      return logins
    } catch (e) {
      console.error(e)
      console.dir(e.response.data, { colors: true, depth: 4 })
    }
  },
}

module.exports = pathService
