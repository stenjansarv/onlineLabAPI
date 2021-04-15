const moment = require('moment')
const Joi = require('joi')
const contextualize = require('../../context')
const extract = require('../../extract')
const uuid = require('uuid')

const { success, invalid } = require('../../respond')
const serialize = require('../../serializers/publication')

const createPublication = require('../../../lib/populate/create-publication')

const schema = Joi.object().keys({
  publisher_id: Joi.string(),
  publication_id: Joi.string(),
  title: Joi.string(),
  subtitle: Joi.string(),
  publication_date: Joi.number(),
  url: Joi.string(),
  type: Joi.string(),
  journal_title: Joi.string()
})

exports.handler = async (event) => {
  const context = contextualize(event)
  const { body } = extract(event, schema)

  body['publication_id'] = uuid.v4()
  body['@timestamp'] = moment().valueOf()
  body['last_modified_date'] = moment().valueOf()
  body['publication_date'] = moment().valueOf()

  const result = await createPublication(body, context)

  if (result.statusCode === 400) return invalid(result)

  return success(serialize(result))
}
