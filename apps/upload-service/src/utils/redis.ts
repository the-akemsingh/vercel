import { createClient, type RedisClientType } from "redis"
import dotenv from "dotenv"
dotenv.config();

const redisClient: RedisClientType = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
})

await redisClient.connect();


async function pushToQueue(channel: string, payload: string) {
    try {
        await redisClient.lPush(channel, payload);
    } catch (e) {
        console.log("Error pushing projectId to queue", e)
    }
}

export default pushToQueue;