const contextualize = require('../../educationContext')

const { success, invalid } = require('../../respond')
const serialize = require('../../serializers/education')

const deleteEducation = require('../../../lib/populate/educations/delete-education')

exports.handler = async (event) => {
  const context = contextualize(event)

  const result = await deleteEducation(context)

  if (result.statusCode === 400) return invalid(result)

  return success(serialize(result))
}
