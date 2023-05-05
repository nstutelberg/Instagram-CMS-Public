class CreateTemporaryToken {

  createShortToken(axios, instagramAppId, instagramSecret, websiteName, websiteTokenCode, shortTokenUrl) {

    // setting up the parameters to get the short term 1 hour long token

    const params = new URLSearchParams();
    params.append('client_id', instagramAppId);
    params.append('client_secret', instagramSecret);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', websiteName);
    params.append('code', websiteTokenCode);

    // declaring the short token as a global variable
    var shortLivedToken;

    // making a request to get the short lived token information so we can extend it in the next chunk of code
    axios.post(shortTokenUrl, params)
      .then(response => {
        shortLivedToken = response.data.access_token
        console.log(response.data)

        require('dotenv').config();
        const fs = require('fs');
        const envConfig = fs.readFileSync('.env').toString();
        let envVariables = envConfig.split('\n');
        envVariables = envVariables.map(variable => {
          // determining what value will be written to .env file
          if (variable.startsWith('SHORT_LIVED_TOKEN=')) {
            return `SHORT_LIVED_TOKEN='${response.data.access_token}'`;
          } else if (variable.startsWith('INSTA_USER=')) {
            return `INSTA_USER='${response.data.user_id}'`;
          }
          return variable;
        });
        // write to the .env file
        fs.writeFileSync('.env', envVariables.join('\n'));
        return response.data.access_token;

      })
      .catch(error => {
        console.log(error);
      });
  }
}
module.exports = CreateTemporaryToken;
