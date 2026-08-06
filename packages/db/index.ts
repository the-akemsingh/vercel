import { Pool } from 'pg'
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ProjectStatus } from './generated/prisma/client'
import dotenv from 'dotenv'
dotenv.config()

const connectionPool = new Pool({
    connectionString: process.env.DATABASE_URL,

})

const prisma = new PrismaClient({
    adapter: new PrismaPg(connectionPool),
});

export { prisma, ProjectStatus }
