const express = require('express');
const bodyParser = require("body-parser")
const http = require('http');
const socketIO = require('socket.io');

const { generateMessage } = require('./entities/message.js');
const { isRealString } = require('./entities/validation');
const { Users } = require('./entities/users');
const PORT = process.env.PORT || 8080;

const app = express();
const options = {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
};

const server = http.createServer(app);
app.use(express.static("public"));

const io = socketIO(server, options);
const users = new Users();

const defaultRoom = 'General';

io.on('connection', (socket) => {

    socket.on('leave', (params) => {
        socket.leave(params.room);
    });

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Bad request');
        }

        socket.join(params.room);
        users.removeUserById(socket.id);
        users.removeUserByName(params.name);
        users.addUser(socket.id, params.name, params.room);
        // emit an event to update the client state with the new users list
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        console.log(`user name [${params.name}] id [${socket.id}] is connected`)

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        const user = users.getUserById(socket.id);
        if (user && isRealString(message.text)) {
            let tempObj = generateMessage(user.name, user.room, message.text);
            io.to(user.room).emit('newMessage', tempObj);
            callback({
                data: tempObj
            });
        }
        callback();
    });

    socket.on('disconnect', () => {
        const user = users.removeUserById(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
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

