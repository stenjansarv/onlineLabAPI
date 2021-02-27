const contextualize = require('../context')
const { success, invalid } = require('../respond')
const serialize = require('../serializers/publication')

const fetchAll = require('../../lib/finders/fetch-all')

exports.handler = async (event) => {
  const context = contextualize(event)
  const result = await fetchAll(context)

  if (result.statusCode === 400) return invalid(result)

  return success(serialize(result))
}
