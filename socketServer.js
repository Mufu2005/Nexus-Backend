const socketIo = require('socket.io');

const initSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        socket.on('join-room', (roomId, userId) => {
            socket.join(roomId);
            socket.to(roomId).emit('user-connected', userId);

            socket.on('disconnect', () => {
                socket.to(roomId).emit('user-disconnected', userId);
            });
        });
        
        socket.on('send-signal', (payload) => {
            io.to(payload.userToSignal).emit('user-joined', { signal: payload.signal, callerID: payload.callerID });
        });

        socket.on('return-signal', (payload) => {
            io.to(payload.callerID).emit('receiving-returned-signal', { signal: payload.signal, id: socket.id });
        });
    });
};

module.exports = initSocket;