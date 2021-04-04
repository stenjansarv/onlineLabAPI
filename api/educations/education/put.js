const moment = require('moment')
const Joi = require('joi')
const contextualize = require('../../educationContext')
const extract = require('../../extract')

const { success, invalid } = require('../../respond')
const serialize = require('../../serializers/employment')

const putEducation = require('../../../lib/populate/educations/put-education')

const schema = Joi.object().keys({
  publisher_id: Joi.string(),
  education_id: Joi.string(),
  role_title: Joi.string(),
  organization_name: Joi.string(),
  organization_address: Joi.string()
})

exports.handler = async (event) => {
  const context = contextualize(event)
  const { body } = extract(event, schema)

  const payload = {}

  if (body.role_title) payload['role_title'] = body.role_title
  if (body.organization_name) payload['organization_name'] = body.organization_name
  if (body.organization_address) payload['organization_address'] = body.organization_address
  payload['last_modified_date'] = moment().valueOf()

  const result = await putEducation(payload, context)

  if (result.statusCode === 400) return invalid(result)

  return success(serialize(result))
}
