const contextualize = require('../../employmentContext')

const { success, invalid } = require('../../respond')
const serialize = require('../../serializers/employment')

const deleteEmployment = require('../../../lib/populate/employments/delete-employment')

exports.handler = async (event) => {
  const context = contextualize(event)

  const result = await deleteEmployment(context)

  if (result.statusCode === 400) return invalid(result)

  return success(serialize(result))
}
