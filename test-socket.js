const io = require('socket.io-client');

const SERVER_URL = 'http://localhost:5000';
const ROOM_ID = 'test-room-123';

const socketA = io(SERVER_URL);
const socketB = io(SERVER_URL);

socketA.on('connect', () => {
    console.log('User A connected:', socketA.id);
    socketA.emit('join-room', ROOM_ID, 'UserA_ID');
});

socketB.on('connect', () => {
    console.log('User B connected:', socketB.id);
    setTimeout(() => {
        socketB.emit('join-room', ROOM_ID, 'UserB_ID');
    }, 500);
});

socketA.on('user-connected', (userId) => {
    console.log(`User A notification: ${userId} joined the room`);
    const signalData = { type: 'offer', sdp: 'dummy-sdp-data' };
    socketA.emit('send-signal', { userToSignal: socketB.id, signal: signalData, callerID: socketA.id });
});

socketB.on('user-joined', (payload) => {
    console.log('User B received signal from:', payload.callerID);
    const signalData = { type: 'answer', sdp: 'dummy-answer-data' };
    socketB.emit('return-signal', { signal: signalData, callerID: payload.callerID });
});

socketA.on('receiving-returned-signal', (payload) => {
    console.log('User A received return signal from:', payload.id);
    console.log('Handshake Complete. Test Passed.');
    socketA.disconnect();
    socketB.disconnect();
});