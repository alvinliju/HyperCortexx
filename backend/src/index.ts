import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors'
import authRoute from '../src/routes/authRoute'
import cortexRoute from '../src/routes/cortexRoutes'
import previewRoute from '../src/routes/scrapeMetaData'
import morgan from 'morgan'
import {apiLimiter} from './services/rateLimiter';


const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));


app.use(express.json());

app.use(morgan('combined'));


app.use(apiLimiter)

app.use('/auth', authRoute)
app.use('/cortexses', cortexRoute)
app.use('/preview', previewRoute)


app.get('/', (req, res) => {
    res.send('Hello world');
})



export default app;