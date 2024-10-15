const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Cho phép tất cả các origin trong môi trường phát triển
    methods: ["GET", "POST"]
  }
});

const router = require('./routers/root');

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.use('/api', router);

app.get('/', (req, res) => {
    res.send('Todo API is running');
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Todo API listening on http://localhost:${port}`);
});

module.exports = { io }; // Export io để sử dụng ở nơi khác