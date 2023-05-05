//import axios for api calls and import the classes
const axios = require('axios')
const CheckTokenStatus = require('../../app_scripts/utils/check_token_status.js')
const RequestInstagramData = require('../../app_scripts/utils/request_instagram_data.js')
const RenewToken = require('../../app_scripts/utils/renew_token.js')
const { schedule } = require('@netlify/functions')

//import dotenv and the functionality to write back to the env file with updated token value
var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')
var myEnv = dotenv.config()
dotenvExpand.expand(myEnv)

//importing redis
const { createClient } = require('redis');
const client = createClient({
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});
const redis = require('redis')

//bring in .env variables and instantiate the classes
const sixtyDayToken = process.env.SIXTY_DAY_TOKEN
const baseInfoUrl = process.env.BASE_INFO_URL
const mediaUrl = process.env.MEDIA_URL
const rootUrl = process.env.ROOT_URL
const refreshAccessTokenUrl = process.env.REFRESH_ACCESS_TOKEN_URL
const checkTokenStatus = new CheckTokenStatus()
const requestInstagramData = new RequestInstagramData()
const renewToken = new RenewToken()

// To learn about scheduled functions and supported cron extensions,
// see: https://ntl.fyi/sched-func
module.exports.handler = schedule('* * * * *', async (event) => {
  const eventBody = JSON.parse(event.body)
  console.log(`Next function run at ${eventBody.next_run}.`)

  return {
    statusCode: 200,
  }
})

const handler = async (event, context) => {
  try {
    await checkTokenStatus.checkStatus(axios, sixtyDayToken)

    const data = await requestInstagramData.getData(
      axios,
      sixtyDayToken,
      baseInfoUrl,
      mediaUrl,
      rootUrl,
      client
    )

    return {
      statusCode: 200
    }
  } catch (error) {
    console.error('Error:', error.message)

    if (error.response && error.response.status === 401) {
      console.log('Renewing token...')

      const newToken = await renewToken.renew(
        axios,
        sixtyDayToken,
        refreshAccessTokenUrl
      )

      console.log('Token renewed successfully')

      const data = await requestInstagramData.getData(
        axios,
        newToken,
        baseInfoUrl,
        mediaUrl,
        rootUrl,
        client
      )

      return {
        statusCode: 200
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      }
    }
  }
}

module.exports = { handler }
