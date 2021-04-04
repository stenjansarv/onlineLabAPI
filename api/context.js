const { contextualize } = require('../lib/context')

module.exports = (event) => {
  const { publisherId, publicationId } = event.pathParameters
  const context = contextualize({ publisherId, publicationId })

  return context
}
