// allowing for string interpolation in the .env file by requiring dotenv-expand
var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')
var myEnv = dotenv.config()
dotenvExpand.expand(myEnv)

// defining axios for GET requests and importing class
const axios = require('axios');

//importing redis
const { createClient } = require('redis');
const client = createClient({
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});
const redis = require('redis')

// instantiating the classes
const RequestInstagramData = require('../utils/request_instagram_data');
const requestInstagramData = new RequestInstagramData();

const CheckTokenStatus = require('../utils/check_token_status')
const checkTokenStatus = new CheckTokenStatus();

const RenewToken = require('../utils/renew_token');
const renewToken = new RenewToken();

// importing variables from .env file
let rootUrl = process.env.ROOT_URL
let sixtyDayToken = process.env.SIXTY_DAY_TOKEN
let baseInfoUrl = process.env.BASE_INFO_URL
let mediaUrl = process.env.MEDIA_URL
refreshAccessTokenUrl = process.env.REFRESH_ACCESS_TOKEN_URL




async function main() {
    try {
        
      await checkTokenStatus.checkStatus(axios, 
                                        sixtyDayToken);

      await requestInstagramData.getData(axios, 
                                        sixtyDayToken, 
                                        baseInfoUrl, 
                                        mediaUrl, 
                                        rootUrl,
                                        client);
                                        
    } catch (error) {

      console.error('Error:', error.message);
      console.log('Renewing token...');

      try {
        const newToken = await renewToken.renew(axios, 
                                                sixtyDayToken, 
                                                refreshAccessTokenUrl);

        console.log('Token renewed successfully');
        await requestInstagramData.getData(axios, 
                                            newToken, 
                                            baseInfoUrl, 
                                            mediaUrl, 
                                            rootUrl,
                                            client);
                                            
      } catch (error) {

        console.error('Error renewing token:', error.message);
        
      }
    }
  }
  
  main();

//next steps
//1. check how many seconds are left on the token and refresh it if its less than a few days
    //going to use a serverless function that has one main that you can separate. 
    //check out this link and set up an account: https://www.netlify.com/blog/2021/12/12/how-to-test-serverless-functions-locally/ and get a netlify local serverless function running
    // https://app.netlify.com/sites/funny-babka-363433/functions
    //create a new sity with netlify and run function locally, it will get a route to your localhost. netlify sets up a site for a git repo basically
    //create 2 mains, one for an api call and one to refresh the token
    //BIGGEST THING IS TO GET THIS WORKING WITH NETLIFY SO SEB CAN ACCESS WEBSITE AND HIT API CALL, AND ANOTHER PAGE TO RENEW TOKEN
    //need to create a site with netlify and direct data to that site instead of console

//where will the data go
    //maybe the token and id information will go to redis to be stored
    //maybe the api output will be on netlify site with a scheduled function

