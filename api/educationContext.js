const { educationContext } = require('../lib/context')

module.exports = (event) => {
  const { publisherId, educationId } = event.pathParameters
  const context = educationContext({ publisherId, educationId })

  return context
}
