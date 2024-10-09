const PORT = 8888;
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const http = require('http');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const socketHandler = require('./socket.js'); // Import socket handler
const { PeerServer } = require('peer');
const peerServer = PeerServer({ port:9000, path: '/myapp'})

const app = express();
const server = http.createServer(app); // Use HTTP server for Socket.IO
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

// Middleware setup
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const client = new MongoClient('mongodb://localhost:27017');

// Delegate all Socket.IO logic to the separate socket.js file
socketHandler.connect(io, PORT);

// User Db operations
const users = require('./dbOperations/userOps');
app.post('/userInsert', (req, res) => (users.insert(req, res, client)));
app.get('/userFind', (req, res) => (users.find(req, res, client)));
app.post('/userUpdate', (req, res) => (users.update(req, res, client)));
app.post('/userDelete', (req, res) => (users.delete(req, res, client)));
app.post('/login', (req, res) => (users.login(req, res, client)));
app.post('/uploadProfilePicture', (req, res) => (users.profilePic(req, res, client)));
app.get('/getProfilePicture', (req, res) => (users.getProfilePicture(req, res, client)));

// Group Db operations
const groups = require('./dbOperations/groupOps');
app.post('/groupInsert', (req, res) => (groups.insert(req, res, client)));
app.get('/groupFind', (req, res) => (groups.find(req, res, client)));
app.post('/groupUpdate', (req, res) => (groups.update(req, res, client)));
app.post('/groupDelete', (req, res) => (groups.delete(req, res, client)));

const fileOps = require('./dbOperations/fileOps.js');
app.post('/uploadChatImage', (req, res) => {
    fileOps.uploadChatImage(req, res); // Use the dedicated file upload function
  });

// Start the server
server.listen(PORT, () => {
    console.log('Server listening on port:', PORT);
});
