import express from 'express';
import cors from 'cors';

const app = express()
const PORT = 8080

app.use(cors())
app.use(express.json())


app.get('/api', (request, response) => {
    response.json('HELLO FROM BACKEND');
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})