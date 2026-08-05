import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors'
import uploadeRouter from './routers/uploadProject';



const app = express();
app.use(express.json());
app.use(cors())


app.use("/api/v1", uploadeRouter)

app.listen(process.env.PORT || 3000, () => {
    console.log(`uploader server listening on port ${process.env.PORT || 3000}`)
})