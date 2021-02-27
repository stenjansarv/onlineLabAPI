const { flatMap } = require('lodash')

module.exports = async (connection, prefix, context, records) => {
  const body = flatMap(records, record => {
    const publisherId = record['publisher_id']
    return [{ index: { _index: `${prefix}-${publisherId}` } }, record]
  })

  return connection.bulk({ refresh: true, body })
}
