//const client = createClient({
//   password: '0CJN62CRMoKeCVDMuvf46J8mSJNtOd09',
//   host: 'redis-16922.c81.us-east-1-2.ec2.cloud.redislabs.com',
//   port: 16922
//});

//const redis = require('redis');

const redis = require("redis");

const client = redis.createClient({
    password: '0CJN62CRMoKeCVDMuvf46J8mSJNtOd09',
    host: 'redis-16922.c81.us-east-1-2.ec2.cloud.redislabs.com',
    port: 16922
});

client.on('connect', () => {
    console.log('Redis client connected');
    console.log('hi');
});

client.on('error', (err) => {
    console.log('Redis client error:', err);
});


// to test: rdcli -h redis-16922.c81.us-east-1-2.ec2.cloud.redislabs.com -a 0CJN62CRMoKeCVDMuvf46J8mSJNtOd09 -p 16922
//redis-cli -h redis-16922.c81.us-east-1-2.ec2.cloud.redislabs.com -a 0CJN62CRMoKeCVDMuvf46J8mSJNtOd09
//redis-cli -h redis-16922.c81.us-east-1-2.ec2.cloud.redislabs.com -p 16922 -a
// can do PING, or SET key1 value1, then GET key1

//it works on ubuntu when I log into the server with redis-cli, and this code uses the same info but doesn't return results