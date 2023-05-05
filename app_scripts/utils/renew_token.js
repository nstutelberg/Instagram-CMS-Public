class RenewToken {
    // Update the function to use the result of the RenewToken function to update the .env file variable SIXTY_DAY_TOKEN
    renew(axios, sixtyDayToken, refreshAccessTokenUrl) {
        return axios.get(refreshAccessTokenUrl, {
            params: {
                access_token: sixtyDayToken,
                grant_type: 'ig_refresh_token'
            }
        })
            .then(response => {
                console.log(response.data.refresh_token);

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
                return response.data.refresh_token;

            })
            .catch(error => {
                console.log(error);
                return null;
            });
    }
}
module.exports = RenewToken;
