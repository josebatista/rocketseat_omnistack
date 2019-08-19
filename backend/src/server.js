const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

mongoose.connect(
    "mongodb+srv://omnistack:omnistack@cluster0-p6ime.mongodb.net/omnistack?retryWrites=true&w=majority",
    {
        useNewUrlParser: true
    }
);

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
    const { user } = socket.handshake.query;
    connectedUsers[user] = socket.id;
});

//middleware para enviar as informacoes na requisicao
app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

app.use(cors());
app.use(express.json());
app.use(routes)

server.listen(3333);