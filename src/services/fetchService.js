const pathService = require('./pathService')

const fetchService = {
  async getPageDetails(headers, direction, date) {
    let nextURL = ''
    let lastURL = ''
    let next = ''
    let last = ''
    let hasCallback = false
    const link = headers['link']
    const nextValue = '<'
    const nextEnd = '>; rel="next", <'
    const lastValue = 'next", <'
    const lastEnd = '>; rel="last"'

    try {
      // Check if more pages exist
      if (link !== undefined) {
        nextURL = await link.substring(
          link.indexOf(nextValue),
          link.indexOf(nextEnd),
        )
        lastURL = await link.substring(
          link.indexOf(lastValue),
          link.indexOf(lastEnd),
        )

        // Create new strings of "next" & "last" URLs
        next = await nextURL.replace(nextValue, '')
        last = await lastURL.replace(lastValue, '')
      }

      if (last.length > 0 && next.length > 0) {
        switch (direction) {
          // Issues & Pulls routes
          case 'since':
            hasCallback = await pathService.setPath(next, last, false)
            break
          // Repo comments route
          case 'continuous':
            hasCallback = await pathService.setPath(next, last, date)
            break
        }
      }

      // Return array from "path()" function
      if (hasCallback) {
        return hasCallback
      }
    } catch (e) {
      console.error(e)
      console.dir(e.response.data, { colors: true, depth: 4 })
    }
  },
}
module.exports = fetchService
