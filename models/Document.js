const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Draft', 'Reviewed', 'Signed'],
        default: 'Draft',
    },
    signature: {
        type: String,
        default: null,
    },
    version: {
        type: Number,
        default: 1,
    }
}, {
    timestamps: true,
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;