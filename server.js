require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./routers/root');

app.use(express.json());

const port = process.env.PORT || 5000;
app.use(cors());


app.use('/api', router);


app.get('/', (req, res) => {
    res.send('Todo API is running');
});


app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
    console.log(`Todo API listening on http://localhost:${port}`);
});