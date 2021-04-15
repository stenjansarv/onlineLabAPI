const moment = require('moment')
const _ = require('lodash')
const fetch = require('node-fetch')
const contextualize = require('../context')
const { success, invalid } = require('../respond')
const serialize = require('../serializers/publication')

const mapPublicationToObject = (publication, context) => {
  return _.omitBy({
    '@timestamp': moment().valueOf(),
    publisher_id: context.publisherId,
    publication_id: _.get(publication['work-summary'][0], 'put-code'),
    publication_date: moment(`${_.get(publication['work-summary'][0], 'publication-date.year.value', _.get(publication['work-summary'][0], 'created-date.value'))}-${_.get(publication['work-summary'][0], 'publication-date.month.value', '01')}-${_.get(publication['work-summary'][0], 'publication-date.day.value', '01')}`).valueOf(),
    last_modified_date: _.get(publication['work-summary'][0], 'last-modified-date.value'),
    title: _.get(publication['work-summary'][0], 'title.title.value'),
    subtitle: _.get(publication['work-summary'][0], 'title.subtitle'),
    url: _.get(publication['work-summary'][0], 'url.value'),
    type: _.get(publication['work-summary'][0], 'type'),
    journal_title: _.get(publication['work-summary'][0], 'journal-title.value')
  }, _.isUndefined)
}

exports.handler = async (event) => {
  const context = contextualize(event)

  if (_.isEmpty(result)) {
    const response = await fetch(`https://pub.orcid.org/v3.0/${context.publisherId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const body = await response.json()

    const importedPublications = body.group
  
    const payload = _.map(importedPublications, publication => mapPublicationToObject(publication, context))
    
    return success(payload)
  }

  if (result.statusCode === 400) return invalid(result)

  return success(serialize(result))
}
