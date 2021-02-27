const _ = require('lodash')

module.exports = (results) => {
  if (!results || _.isEmpty(results)) return

  return results.map(result => {
    return {
      timestamp: result._source.timestamp || result._source['@timestamp'],
      publisher_id: result._source.publisher_id,
      education_id: result._source.education_id,
      start_date: result._source.start_date,
      end_date: result._source.end_date,
      last_modified_date: result._source.last_modified_date,
      role_title: result._source.role_title,
      organization_name: result._source.organization_name,
      organization_address: result._source.organization_address
    }
  })
}
