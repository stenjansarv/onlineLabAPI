const moment = require('moment')
const _ = require('lodash')
const fetch = require('node-fetch')
const contextualize = require('../context')

const { success, invalid } = require('../respond')
const serialize = require('../serializers/employment')

const putEmployments = require('../../lib/populate/employments/upload-employments')

const mapEmploymentToObject = (employment, context) => {
  const orgCity = _.get(employment['summaries'][0]['employment-summary'], 'organization.address.city', null)
  const orgRegion = _.get(employment['summaries'][0]['employment-summary'], 'organization.address.region', null)
  const orgCountry = _.get(employment['summaries'][0]['employment-summary'], 'organization.address.country', null)
  const address = [orgCity, orgRegion, orgCountry].filter(item => item !== null)

  console.log(`${_.get(employment['summaries'][0]['employment-summary'], 'end-date.year.value')}-${_.get(employment['summaries'][0]['employment-summary'], 'end-date.month.value', '01')}-${_.get(employment['summaries'][0]['employment-summary'], 'end-date.day.value', '01')}`)

  return _.omitBy({
    '@timestamp': moment().valueOf(),
    publisher_id: context.publisherId,
    employment_id: _.get(employment['summaries'][0]['employment-summary'], 'put-code'),
    role_title: _.get(employment['summaries'][0]['employment-summary'], 'role-title'),
    start_date: _.get(employment['summaries'][0]['employment-summary'], 'start-date.year.value', null) === null ? null : moment(`${_.get(employment['summaries'][0]['employment-summary'], 'start-date.year.value')}-${_.get(employment['summaries'][0]['employment-summary'], 'start-date.month.value', '01')}-${_.get(employment['summaries'][0]['employment-summary'], 'start-date.day.value', '01')}`).valueOf(),
    end_date: _.get(employment['summaries'][0]['employment-summary'], 'end-date.year.value', null) === null ? null : moment(`${_.get(employment['summaries'][0]['employment-summary'], 'end-date.year.value')}-${_.get(employment['summaries'][0]['employment-summary'], 'end-date.month.value', '01')}-${_.get(employment['summaries'][0]['employment-summary'], 'end-date.day.value', '01')}`).valueOf(),
    last_modified_date: _.get(employment['summaries'][0]['employment-summary'], 'last-modified-date.value'),
    organization_name: _.get(employment['summaries'][0]['employment-summary'], 'organization.name', null),
    organization_address: `${address.join(', ')}`,
    organization_url: _.get(employment['summaries'][0]['employment-summary'], 'url.value', null),
  }, _.isUndefined)
}

exports.handler = async (event) => {
  const context = contextualize(event)

  const response = await fetch(`https://pub.orcid.org/v3.0/${context.publisherId}/employments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  
  const body = await response.json()
  const employments = body['affiliation-group']

  const payload = _.map(employments, employment => mapEmploymentToObject(employment, context))

  const result = await putEmployments(payload, context)

  if (result.statusCode === 400) return invalid(result)

  return success(serialize(result))
}
