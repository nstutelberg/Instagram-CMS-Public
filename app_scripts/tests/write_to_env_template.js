function envWriter(envVariableName, accessToken) {
    // Update the .env file with the new token
    const fs = require('fs');
    const envPath = '.env';
    try {
        const envConfig = fs.readFileSync(envPath).toString();
        let envVariables = envConfig.split('\n');
        let variableFound = false;
        envVariables = envVariables.map(variable => {
            // determing what value will be written to .env file
            if (variable.startsWith(`${envVariableName}=`)) {
                variableFound = true;
                return `${envVariableName}=${accessToken}`;
            }
            return variable;
        });
        if (!variableFound) {
            throw new Error(`Environment variable ${envVariableName} not found in ${envPath}`);
        }
        // write to the .env file
        fs.writeFileSync(envPath, envVariables.join('\n'));
        return accessToken;
    } catch (err) {
        console.error(err);
        return null;
    }
}
