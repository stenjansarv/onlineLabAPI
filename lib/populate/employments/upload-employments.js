const _ = require('lodash')
const { connection } = require('../../elasticsearch')

module.exports = async (payload, context) => {
  const bulkBody = payload.flatMap(doc => [{ index: { _index: `publisher-${context.publisherId}-employments`, _id: doc.employment_id } }, doc])
  const { body: bulkResponse } = await connection.bulk({ refresh: true, body: bulkBody })

  if (bulkResponse.errors) {
    const erroredDocuments = []
    // The items array has the same order of the dataset we just indexed.
    // The presence of the `error` key indicates that the operation
    // that we did for the document has failed.
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0]
      if (action[operation].error) {
        erroredDocuments.push({
          // If the status is 429 it means that you can retry the document,
          // otherwise it's very likely a mapping error, and you should
          // fix the document before to try it again.
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1]
        })
      }
    })
    console.error('The errored documents - ', erroredDocuments)
  }

  if (_.get(bulkResponse, 'meta') === 400) return bulkResponse.meta

  return _.isEmpty(_.get(bulkResponse, 'body.hits', [])) ? [] : _.get(bulkResponse, 'body.hits.hits', [])
}