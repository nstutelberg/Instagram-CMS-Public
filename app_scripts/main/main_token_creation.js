// allowing for string interpolation in the .env file by requiring dotenv-expand
var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')
var myEnv = dotenv.config()
dotenvExpand.expand(myEnv)

// defining axios for GET requests and importing class
const axios = require('axios');

// instantiating the classes
const CreateTemporaryToken = require('./create_temporary_token')
const createTemporaryToken = new CreateTemporaryToken();

const CreateSixtyDayToken = require('./create_sixty_day_token');
const createSixtyDayToken = new CreateSixtyDayToken();

//defining reusable data

let instagramAppId = process.env.INSTAGRAM_APP_ID
let instagramSecret = process.env.INSTAGRAM_SECRET
let websiteName = process.env.WEBSITE_NAME
let websiteTokenCode = process.env.WEBSITE_TOKEN_CODE
let rootUrl = process.env.ROOT_URL
let shortTokenUrl = process.env.SHORT_TOKEN_URL

function main() {
    createTemporaryToken.createShortToken(axios,
        instagramAppId,
        instagramSecret,
        websiteName,
        websiteTokenCode,
        shortTokenUrl);

    createSixtyDayToken.createLongToken(axios,
        instagramAppId,
        instagramSecret,
        websiteName,
        websiteTokenCode,
        rootUrl);
}
main();
