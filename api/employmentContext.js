const { employmentContext } = require('../lib/context')

module.exports = (event) => {
  const { publisherId, employmentId } = event.pathParameters
  const context = employmentContext({ publisherId, employmentId })

  return context
}
