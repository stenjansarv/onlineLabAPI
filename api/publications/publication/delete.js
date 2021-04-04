const contextualize = require('../../context')

const { success, invalid } = require('../../respond')
const serialize = require('../../serializers/publication')

const deletePublication = require('../../../lib/populate/delete-publication')

exports.handler = async (event) => {
  const context = contextualize(event)

  const result = await deletePublication(context)

  if (result.statusCode === 400) return invalid(result)

  return success(serialize(result))
}
