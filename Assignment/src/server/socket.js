module.exports = {
    connect: function(io, PORT) {
        const chat = io.of('/chat'); // Create a namespace called /chat
        const connectedUsers = {}; // Object to store connected users { socketId: { username, peerId } }
        const messageHistory = []; // Array to store the chat message history

        chat.on('connection', (socket) => {
            console.log('User connected to /chat namespace with socket ID:', socket.id);

            // Send the last 5 messages to the newly connected user
            socket.emit('message-history', messageHistory.slice(-5));

            // Listen for the join event with both the username and peerId from the client
            socket.on('join', ({ username, peerId }) => {
                if (username && peerId) {
                    connectedUsers[socket.id] = { username, peerId }; // Store the username and peerId by socket ID
                    console.log(`${username} has joined the chat with Peer ID: ${peerId}`);

                    // Create the join message
                    const joinMessage = { 
                        username: username, 
                        message: ` has joined the chat`, 
                        profilePicture: 'assets/default-avatar.png' 
                    };

                    // Add the join message to the message history
                    messageHistory.push(joinMessage);

                    // Broadcast the join message to all clients in the chat
                    chat.emit('message', joinMessage);

                    // Broadcast the updated user list to all clients
                    updatePeerList(chat, connectedUsers); // Call the function to update the peer list
                }
            });

            // Listen for incoming messages from the client
            socket.on('message', (data) => {
                console.log(`Message received from ${data.username}: ${data.message}`);
                messageHistory.push(data); // Add the incoming message to the message history
                chat.emit('message', data); // Emit the message data with profile picture to all clients
            });

            // Handle user disconnect event
            socket.on('disconnect', () => {
                const disconnectedUser = connectedUsers[socket.id]?.username || 'A user';
                console.log('User disconnected from /chat namespace:', disconnectedUser);
                const disconnectMessage = { 
                    message: ` has left the chat`, 
                    username: disconnectedUser, 
                    profilePicture: 'assets/default-avatar.png' 
                };
                messageHistory.push(disconnectMessage); // Add the disconnect message to the history
                chat.emit('message', disconnectMessage); // Broadcast to all clients
                delete connectedUsers[socket.id]; // Remove the user from the list

                // Broadcast the updated user list to all clients
                updatePeerList(chat, connectedUsers); // Call the function to update the peer list
            });
        });

        // Function to update and emit the peer list to all connected clients
        function updatePeerList(chatNamespace, users) {
            const peerList = Object.values(users); // Extract the list of peers
            chatNamespace.emit('peer-list', peerList); // Send the updated peer list to all clients
            console.log('Updated peer list sent to all clients:', peerList); // Debug log
        }
    }
}
