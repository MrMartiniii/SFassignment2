module.exports = {
    connect: function(io, PORT) {
        const chat = io.of('/chat'); // Create a namespace called /chat

        // Handle connections within the /chat namespace
        chat.on('connection', (socket) => {
            console.log('User connected to /chat namespace with socket ID:', socket.id);

            let currentUsername = ''; // Variable to store the username for this socket

            // Listen for the join event with the username from the client
            socket.on('join', (username) => {
                currentUsername = username; // Store the username for this socket
                console.log(`${username} has joined the chat`);
                chat.emit('message', `${username} has joined the chat`); // Broadcast the join message
            });

            // Listen for incoming messages from the client
            socket.on('message', (data) => {
                console.log(`Message received from ${data.username}: ${data.message}`);
                const messageWithUsername = `${data.username}: ${data.message}`;
                chat.emit('message', messageWithUsername); // Emit the message with username to all clients
            });

            // Listen for peer-data event from the client
            socket.on('peer-data', (data) => {
                console.log('User has joined with Peer ID and Username:', data);
                socket.broadcast.emit('peer-data', data); // Notify all other users about this peer's data
            });

            // socket.on('peer-id', (peerId) => {
            //     console.log('User has joined with peer ID:', peerId);
            //     socket.broadcast.emit('peer-id', peerId); // Notify all other users about this peer ID
            // });

            // Handle user disconnect event
            socket.on('disconnect', () => {
                console.log('User disconnected from /chat namespace:', currentUsername || socket.id);
                chat.emit('message', `${currentUsername || 'A user'} has left the chat`);
                currentUsername = ''; // Clear the username state when the user disconnects
            });
        });
    }
}
