const contextualize = require('../employmentContext')

const { success, invalid } = require('../respond')
const serialize = require('../serializers/employment')

const deleteEmployments = require('../../lib/populate/employments/unload-employments')

exports.handler = async (event) => {
  const context = contextualize(event)

  const result = await deleteEmployments(context)

  if (result.statusCode === 400) return invalid(result)

  return success(serialize(result))
}
