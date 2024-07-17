const redis = require('redis')
const client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:6379`
})
const asyncHandler = require('express-async-handler')

client.on('error', (err) => {
    console.error('Redis error:', err)
}).on('connect', () => console.log('Conneted to Redis server!')).connect()

const cacheMiddleware = asyncHandler(async (req, res, next) => {
    console.log('Out if');
    const { originalUrl  } = req
    const data = await client.get(originalUrl )
    console.log(data)
    if (data !== null) {
        console.log('in if');
        res.json(JSON.parse(data))
    } else {
        console.log("Null data")
        next()
    }
})


module.exports = { cacheMiddleware }