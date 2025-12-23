const express = require('express');
const router = express.Router();
const { scheduleMeeting, getMeetings, cancelMeeting } = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, scheduleMeeting)
    .get(protect, getMeetings);

router.route('/:id/cancel')
    .put(protect, cancelMeeting);

module.exports = router;