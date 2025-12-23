const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema({
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    title: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['scheduled', 'cancelled', 'completed'],
        default: 'scheduled',
    },
    roomId: {
        type: String,
        unique: true,
    }
}, {
    timestamps: true,
});

const Meeting = mongoose.model('Meeting', meetingSchema);
module.exports = Meeting;