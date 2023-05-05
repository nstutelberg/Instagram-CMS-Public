class CreateSixtyDayToken {

  //making a request to extend the token to get a 60 day token

  createLongToken(axios, instagramSecret, accessUrl, shortLivedToken) {

    axios.get(accessUrl, {
      params: {
        client_secret: instagramSecret,
        access_token: shortLivedToken,
        grant_type: 'ig_exchange_token'
      }
    })
      .then(response => {
        sixtyDayToken = response.data.access_token
        console.log(response.data);

        // Update the .env file with the new token
        require('dotenv').config();
        const fs = require('fs');
        const envConfig = fs.readFileSync('.env').toString();
        let envVariables = envConfig.split('\n');
        envVariables = envVariables.map(variable => {
          // determing what value will be written to .env file
          if (variable.startsWith('SIXTY_DAY_TOKEN=')) {
            return `SIXTY_DAY_TOKEN='${response.data.access_token}'`;
          }
          return variable;
        });
        // write to the .env file
        fs.writeFileSync('.env', envVariables.join('\n'));
        return response.data.access_token;

      })
      .catch(error => {
        console.log(error);
        // handle the error
      });
  }
}
module.exports = CreateSixtyDayToken;
