const moment = require('moment')
const _ = require('lodash')
const fetch = require('node-fetch')
const contextualize = require('../educationContext')
const { success, invalid } = require('../respond')
const serialize = require('../serializers/education')

const fetchAll = require('../../lib/finders/educations/fetch-all')

const mapEducationToObject = (education, context) => {
  const orgCity = _.get(education['summaries'][0]['education-summary'], 'organization.address.city', null)
  const orgRegion = _.get(education['summaries'][0]['education-summary'], 'organization.address.region', null)
  const orgCountry = _.get(education['summaries'][0]['education-summary'], 'organization.address.country', null)
  const address = [orgCity, orgRegion, orgCountry].filter(item => item !== null)

  return _.omitBy({
    '@timestamp': moment().valueOf(),
    publisher_id: context.publisherId,
    education_id: _.get(education['summaries'][0]['education-summary'], 'put-code'),
    start_date: _.get(education['summaries'][0]['education-summary'], 'start-date.year.value', null) === null ? null : moment(`${_.get(education['summaries'][0]['education-summary'], 'start-date.year.value', '0000')}-${_.get(education['summaries'][0]['education-summary'], 'start-date.month.value', '01')}-${_.get(education['summaries'][0]['education-summary'], 'start-date.day.value', '01')}`).valueOf(),
    end_date: _.get(education['summaries'][0]['education-summary'], 'end-date.year.value', null) === null ? null : moment(`${_.get(education['summaries'][0]['education-summary'], 'end-date.year.value', '0000')}-${_.get(education['summaries'][0]['education-summary'], 'end-date.month.value', '01')}-${_.get(education['summaries'][0]['education-summary'], 'end-date.day.value', '01')}`).valueOf(),
    last_modified_date: _.get(education['summaries'][0]['education-summary'], 'last-modified-date.value'),
    role_title: _.get(education['summaries'][0]['education-summary'], 'role-title'),
    organization_name: _.get(education['summaries'][0]['education-summary'], 'organization.name'),
    organization_address: `${address.join(', ')}`,
  }, _.isUndefined)
}

exports.handler = async (event) => {
  const context = contextualize(event)
  const result = await fetchAll(context)

  if (_.isEmpty(result)) {
    const response = await fetch(`https://pub.orcid.org/v3.0/${context.publisherId}/educations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const body = await response.json()

    const importedEducations = body['affiliation-group']
  
    const payload = _.map(importedEducations, education => mapEducationToObject(education, context))

    return success(payload)
  }

  if (result.statusCode === 400) return invalid(result)

  return success(serialize(result))
}
