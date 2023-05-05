
//const redis = require('redis');

const redis = require("redis");

const client = redis.createClient({
    password: 'SENSITIVE INFORMATION - N/A'',
    host: 'SENSITIVE INFORMATION - N/A',
    port: 'SENSITIVE INFORMATION - N/A'
});

client.on('connect', () => {
    console.log('Redis client connected');
    console.log('hi');
});

client.on('error', (err) => {
    console.log('Redis client error:', err);
});
