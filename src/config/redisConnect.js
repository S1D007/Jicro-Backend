const redis = require('redis');
const client = redis.createClient();
const connection = async () =>{
    client.on('connect', function() {
        console.log('Connected to Redis');
    });
    await client.connect();
}

module.exports = {client,connection};
