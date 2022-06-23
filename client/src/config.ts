const apiId = '69eo66c9wi'
const auth0Domain = 'dev-a0eo9sjj.us.auth0.com'
const auth0ClientId = 'CteUF2eaGtR7z3ZCrgaEFdjPtFG3OPtl'

export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  domain: auth0Domain,
  clientId: auth0ClientId,
  callbackUrl: 'http://localhost:3000/callback',
}
