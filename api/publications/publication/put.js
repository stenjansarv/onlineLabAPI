const moment = require('moment')
const Joi = require('joi')
const contextualize = require('../../context')
const extract = require('../../extract')

const { success, invalid } = require('../../respond')
const serialize = require('../../serializers/publication')

const putPublication = require('../../../lib/populate/put-publication')

const schema = Joi.object().keys({
  publisher_id: Joi.string(),
  publication_id: Joi.string(),
  title: Joi.string(),
  subtitle: Joi.string(),
  publication_date: Joi.number(),
  last_modified_date: Joi.number(),
  url: Joi.string(),
  type: Joi.string(),
  journal_title: Joi.string()
})

exports.handler = async (event) => {
  const context = contextualize(event)
  const { payload, body } = extract(event, schema)

  if (body.title) payload['title'] = body.title
  if (body.journal_title) payload['journal_title'] = body.journal_title
  if (body.url) payload['url'] = body.url
  payload['last_modified_date'] = moment().valueOf()

  const result = await putPublication(payload, context)

  if (result.statusCode === 400) return invalid(result)

  return success(serialize(result))
}
