module.exports = async (connection, query) => {
  return connection.search(query)
}
