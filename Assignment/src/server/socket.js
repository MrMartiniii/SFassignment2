module.exports = {
    connect: function( io, PORT){
        var rooms=['room1','room2','room3'];
        var socketRoom = [];
        var socketRoomNum = [];

        const chat = io.of('/chat');

        chat.on
    }
}