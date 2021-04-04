const contextualize = require('../educationContext')

const { success, invalid } = require('../respond')
const serialize = require('../serializers/education')

const deleteEducations = require('../../lib/populate/educations/unload-educations')

exports.handler = async (event) => {
  const context = contextualize(event)

  const result = await deleteEducations(context)

  if (result.statusCode === 400) return invalid(result)

  return success(serialize(result))
}
