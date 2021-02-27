const contextualize = require('../context')
const extract = require('../extract')

const { success, invalid } = require('../respond')
const serialize = require('../serializers/publication')

const byKeywords = require('../../lib/finders/by-keywords')

exports.handler = async (event) => {
  const context = contextualize(event)
  const { payload } = extract(event)

  const result = await byKeywords(context, payload['keywords'].split(','))

  if (result.statusCode === 400) return invalid(result)

  return success(serialize(result))
}
