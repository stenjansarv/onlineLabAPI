const { isEmpty } = require('lodash')
const { connection } = require('../elasticsearch')

module.exports = async (context) => {
  const queryResult = await connection.delete({
    index: `publisher-${context.publisherId}-publications`,
    id: context.publicationId,
    refresh: 'true'
  }).catch((err) => err)

  if (queryResult.meta && queryResult.meta.statusCode === 400) return queryResult.meta

  return isEmpty(queryResult.body.hits) ? [] : queryResult.body.hits.hits
}