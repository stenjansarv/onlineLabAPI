const { Client } = require('@elastic/elasticsearch')
const { ELASTICSEARCH_HOST, ELASTICSEARCH_PORT } = process.env

const connection = { node: `https://${ELASTICSEARCH_HOST}` }
const elasticsearch = new Client(connection)

module.exports = elasticsearch
