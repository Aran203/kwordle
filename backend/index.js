import express from 'express';
import cors from 'cors';
import {validateWord} from './routes/words.js'

const app = express()
const PORT = 8080

app.use(cors({ origin: 'https://kwordled.vercel.app', methods: ['GET', 'POST'] }));
app.use(express.json());


app.get('/api', (request, response) => {
    response.json('HELLO FROM BACKEND');
});

app.post('/api/validate_word', validateWord)


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})