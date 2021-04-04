const extract = require('../extract')
const fetch = require('node-fetch')

const { success } = require('../respond')

exports.handler = async (event) => {
  const { body } = extract(event)

  const templateParams = {
    to_name: body.to_name,
    from_name: body.from_name,
    message: body.message,
    to_email: body.to_email
  }
  const template = {
    user_id: 'user_mm39ohiViogT0kdb0Qhsl',
    service_id: 'online-lab-smtp-server',
    template_id: 'template_rbs6rqp',
    template_params: templateParams,
    accessToken: 'ffdffef658347cebdd855252619d22ce'
  }

  console.log(template)

  const response = await fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(template)
  })

  return success(response)
}
