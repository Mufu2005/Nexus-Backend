const Meeting = require('../models/Meeting');
const { v4: uuidv4 } = require('uuid');

const scheduleMeeting = async (req, res) => {
    const { title, participants, startTime, endTime } = req.body;
    
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
        return res.status(400).json({ message: 'Start time must be before end time' });
    }

    const conflict = await Meeting.findOne({
        $or: [
            { startTime: { $lt: end }, endTime: { $gt: start } }
        ],
        participants: { $in: [...participants, req.user._id] },
        status: 'scheduled'
    });

    if (conflict) {
        return res.status(409).json({ message: 'Participant has a scheduling conflict' });
    }

    const meeting = await Meeting.create({
        organizer: req.user._id,
        participants,
        title,
        startTime: start,
        endTime: end,
        roomId: uuidv4(),
    });

    res.status(201).json(meeting);
};

const getMeetings = async (req, res) => {
    const meetings = await Meeting.find({
        $or: [{ organizer: req.user._id }, { participants: req.user._id }]
    }).populate('participants', 'name email');
    res.json(meetings);
};

const cancelMeeting = async (req, res) => {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found' });
    }

    if (meeting.organizer.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    meeting.status = 'cancelled';
    await meeting.save();
    res.json({ message: 'Meeting cancelled' });
};

module.exports = { scheduleMeeting, getMeetings, cancelMeeting };