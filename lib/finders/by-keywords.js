const _ = require('lodash')
const bodybuilder = require('bodybuilder')
const { connection, item: { findAll } } = require('../../lib/elasticsearch')

const DOCUMENTS_LIMIT = 200

module.exports = async (context, keywords) => {
  let body = bodybuilder().size(DOCUMENTS_LIMIT)

  // if (!_.isEmpty(keywords)) {
  //   keywords.forEach(keyword => {
  //     body = body.query('match_phrase', 'journal_title', keyword)
  //   })
  // }

  if (!_.isEmpty(keywords) && keywords[0] !== '') {
    keywords.forEach(keyword => {
      body = body.query('match_phrase', 'title', keyword)
    })
  }

  body = body.build()

  const queryResult = await findAll(connection, { index: `publisher-${context.publisherId}-publications`, body })

  return _.isEmpty(queryResult.body.hits) ? [] : queryResult.body.hits.hits
}
