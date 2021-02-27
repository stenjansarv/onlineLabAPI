const _ = require('lodash')

module.exports = (results) => {
  if (!results || _.isEmpty(results)) return

  return results.map(result => {
    return {
      timestamp: result._source.timestamp || result._source['@timestamp'],
      publisher_id: result._source.publisher_id,
      publication_id: result._source.publication_id,
      title: result._source.title,
      subtitle: result._source.subtitle,
      url: result._source.url,
      type: result._source.type,
      journal_title: result._source.journal_title,
      publication_date: result._source.publication_date,
      last_modified_date: result._source.last_modified_date
    }
  })
}
