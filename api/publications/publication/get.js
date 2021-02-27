const contextualize = require('../../context')
const { success, invalid } = require('../../respond')
const serialize = require('../../serializers/publication')

const byId = require('../../../lib/finders/by-id')

exports.handler = async (event) => {
  const context = contextualize(event)
  const result = await byId(context)

  if (result.statusCode === 400) return invalid(result)

  return success(serialize(result))
}
