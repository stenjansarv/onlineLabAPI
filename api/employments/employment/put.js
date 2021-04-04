const moment = require('moment')
const Joi = require('joi')
const contextualize = require('../../employmentContext')
const extract = require('../../extract')

const { success, invalid } = require('../../respond')
const serialize = require('../../serializers/employment')

const putEmployment = require('../../../lib/populate/employments/put-employment')

const schema = Joi.object().keys({
  publisher_id: Joi.string(),
  employment_id: Joi.string(),
  role_title: Joi.string(),
  organization_name: Joi.string(),
  organization_address: Joi.string(),
  organization_url: Joi.string()
})

exports.handler = async (event) => {
  const context = contextualize(event)
  const { body } = extract(event, schema)

  const payload = {}

  if (body.role_title) payload['role_title'] = body.role_title
  if (body.organization_name) payload['organization_name'] = body.organization_name
  if (body.organization_address) payload['organization_address'] = body.organization_address
  if (body.organization_url) payload['organization_url'] = body.organization_url
  payload['last_modified_date'] = moment().valueOf()

  const result = await putEmployment(payload, context)

  if (result.statusCode === 400) return invalid(result)

  return success(serialize(result))
}
