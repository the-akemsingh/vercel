import { createClient, type RedisClientType } from "redis"
import dotenv from "dotenv"
dotenv.config();

const redisClient: RedisClientType = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
})

await redisClient.connect();


while (1) {
    const payload = await redisClient.brPop("PROJECTS", 0)
    const projectId = Number(payload);
}