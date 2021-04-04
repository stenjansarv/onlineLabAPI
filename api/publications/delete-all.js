const contextualize = require('../context')

const { success, invalid } = require('../respond')
const serialize = require('../serializers/publication')

const deletePublications = require('../../lib/populate/unload-publications')

exports.handler = async (event) => {
  const context = contextualize(event)

  const result = await deletePublications(context)

  if (result.statusCode === 400) return invalid(result)

  return success(serialize(result))
}
