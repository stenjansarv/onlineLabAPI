const { isEmpty } = require('lodash')
const { connection } = require('../elasticsearch')

module.exports = async (payload, context) => {
  const queryResult = await connection.index({
    index: `publisher-${context.publisherId}-publications`,
    id: context.publishmentId,
    body: payload,
    refresh: 'true'
  }).catch((err) => err)

  if (queryResult.meta && queryResult.meta.statusCode === 400) return queryResult.meta

  return isEmpty(queryResult.body.hits) ? [] : queryResult.body.hits.hits
}