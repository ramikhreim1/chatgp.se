var Redis = require('ioredis');

let redisClient;

(async () => {
    // redisClient = redis.createClient(`redis://172.31.38.77:6379`);
    redisClient = new Redis(`redis://172.31.34.75:6379`);

    redisClient.on("error", (error) => {
        // if (!err) {
        //console.error(`Error connecting redis : ${error}`);
        // err = true
        // }
    })
    redisClient.on("connect", () => {
        console.log(`redis connected successfully`);
    })
    // Set a TTL of 5 minutes for all keys
    redisClient.on('ready', async () => {
        await redisClient.send_command('config', ['set', 'notify-keyspace-events', 'Ex']);
        redisClient.on('message', (channel, message) => {
            console.log(`Key expired: ${message}`);
        });
    });
    try {
        await redisClient.connect();
    } catch (error) {
    }
})();

module.exports = redisClient;
