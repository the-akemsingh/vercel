import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors'
import authRouter from './routers/authRouter';
import authMiddleware from './middleware/auth';
import projectRouter from './routers/projectStatusRouter';


const app = express();
app.use(express.json());
app.use(cors())


app.use("/api/v1/auth/google", authRouter)
app.use("/api/v1/project", authMiddleware, projectRouter)

const port = process.env.UPLOAD_SERVICE_PORT || 3001;

app.listen(port, () => {
    console.log(`uploader server listening on port ${port}`)
})
