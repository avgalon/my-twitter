const path = require('path');
const express = require('express');
const bodyParser = require("body-parser")
const http = require('http');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./entities/message.js');
const { isRealString } = require('./entities/validation');
const { Users } = require('./entities/users');
const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 8080;

const app = express();
const options = {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
};

const server = http.createServer(app);
app.use(express.static(publicPath));



const io = socketIO(server, options);
const users = new Users();

const defaultRoom = 'General';

/**
 * When a connection to socket io is established
 */
io.on('connection', (socket) => {

    /**
     * when leaving the room
     */
    socket.on('leave', (params) => {
        socket.leave(params.room);
    });

    /**
     * When a user joins
     */
    socket.on('join', (params, callback) => {

        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Bad request');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        // emit an event to update the client state with the new users list
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        console.log(`user name [${params.name}] id [${socket.id}] is connected`)
        // emit an event to update the client state with a new message
        //socket.emit('newMessage', generateMessage('Admin', params.room, 'Welcome to the chat app.'));
        //socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', params.room, `${params.name} has joined.`));

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        const user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            let tempObj = generateMessage(user.name, user.room, message.text);
            io.to(user.room).emit('newMessage', tempObj);
            callback({
                data: tempObj
            });
        }
        callback();
    });

    socket.on('createLocationMsg', (coords) => {
        const user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('createLocationMsg', generateLocationMessage(user.name, user.room, coords.lat, coords.lon));
        }
    });

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', user.room, `${user.name} has left.`));
        }
    });

});

// Handle CORS
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.json({
    type: "*/*"
}))

app.post('/follow', (req, res) => {
    const userId = req.body.userId;
    const follow = req.body.follow;

    try {
        users.followUser(userId, follow);
        io.to(defaultRoom).emit('updateUserList', users.getUserList(defaultRoom));
        res.send({ ok: `User ${userId} is following user ${follow}`})
    }
    catch(error) {
        res.send({ error });
    }
})

app.post('/unfollow', (req, res) => {
    const userId = req.body.userId;
    const unfollow = req.body.unfollow;
    try {
        users.unfollowUser(userId, unfollow);
        io.to(defaultRoom).emit('updateUserList', users.getUserList(defaultRoom));
        res.send({ ok: `User ${userId} is following user ${unfollow}`})
    }
    catch(error) {
        res.send({ error });
    }
})

server.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});

