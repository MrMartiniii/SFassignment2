module.exports = {
    connect: function(io, PORT) {
        const chat = io.of('/chat'); // Create a namespace called /chat
        const rooms = {}; // Object to store room-specific details, including users and message history

        chat.on('connection', (socket) => {
            console.log('User connected to /chat namespace with socket ID:', socket.id);

            // Listen for the join event with room, username, and peerId from the client
            socket.on('join', ({ room, username, peerId }) => {
                if (room && username && peerId) {
                    // Ensure the room exists in the rooms object
                    if (!rooms[room]) {
                        rooms[room] = { users: {}, messageHistory: [] };
                    }

                    // Check if the user is not already in the room to prevent multiple join messages
                    if (!rooms[room].users[socket.id]) {
                        socket.join(room); // Join the specified room
                        console.log(`${username} has joined room: ${room} with Peer ID: ${peerId}`);

                        // Add the user to the room's user list
                        rooms[room].users[socket.id] = { username, peerId };

                        // Create a join message for the room
                        const joinMessage = {
                            username: username,
                            message: `${username} has joined the chat`,
                            profilePicture: 'assets/default-avatar.png',
                        };

                        // Add the join message to the message history
                        rooms[room].messageHistory.push(joinMessage);

                        // Emit the message history to the newly joined user
                        socket.emit('message-history', rooms[room].messageHistory.slice(-5));

                        // Broadcast the join message to all clients in the room, excluding the one who just joined
                        socket.to(room).emit('message', joinMessage);

                        // Broadcast the updated user list to all clients in the room
                        chat.to(room).emit('peer-list', Object.values(rooms[room].users));
                    } else {
                        console.log(`User ${username} is already in room: ${room}`);
                    }
                }
            });

            // Listen for incoming messages from the client
            socket.on('message', (data) => {
                const userRoom = getUserRoom(socket.id);
                if (userRoom) {
                    rooms[userRoom].messageHistory.push(data); // Add the incoming message to the message history
                    chat.to(userRoom).emit('message', data); // Emit the message data with profile picture to all clients in the room
                    console.log(`Message received from ${data.username} in room ${userRoom}: ${data.message}`);
                }
            });

            // Handle user disconnect event
            socket.on('disconnect', () => {
                const userRoom = getUserRoom(socket.id);
                if (userRoom) {
                    const disconnectedUser = rooms[userRoom].users[socket.id]?.username || 'A user';
                    console.log('User disconnected from room:', disconnectedUser);

                    // Create a disconnect message
                    const disconnectMessage = {
                        message: `${disconnectedUser} has left the chat`,
                        username: disconnectedUser,
                        profilePicture: 'assets/default-avatar.png'
                    };

                    // Add the disconnect message to the message history
                    rooms[userRoom].messageHistory.push(disconnectMessage);
                    chat.to(userRoom).emit('message', disconnectMessage); // Broadcast to all clients in the room

                    // Remove the user from the room's user list
                    delete rooms[userRoom].users[socket.id];

                    // Broadcast the updated user list to all clients in the room
                    chat.to(userRoom).emit('peer-list', Object.values(rooms[userRoom].users));

                    // If the room is empty, you can optionally clean up the room
                    if (Object.keys(rooms[userRoom].users).length === 0) {
                        delete rooms[userRoom];
                    }
                }
            });

            // Utility function to get the user's room based on their socket ID
            function getUserRoom(socketId) {
                for (const room in rooms) {
                    if (rooms[room].users[socketId]) {
                        return room;
                    }
                }
                return null;
            }
        });
    }
};
