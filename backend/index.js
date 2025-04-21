import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import {validateWord, getWordOfDay} from './routes/words.js'
import { addSubmission, getSubmisssions, userStats } from './routes/submissions.js';



dotenv.config();
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));




const app = express()
const PORT = 8080

app.use(cors({
    origin: ['http://localhost:5173', 'https://kwordled.vercel.app', 'https://karanbhalla.tech'],
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(express.json());


app.get('/api', (request, response) => {
    response.json('HELLO FROM BACKEND');
});

app.post('/api/validate_word', validateWord)
app.get('/api/getWordOfDay', getWordOfDay);
app.post('/api/submit', addSubmission)
app.post('/api/submissions', getSubmisssions)
app.post('/api/stats', userStats)



app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})