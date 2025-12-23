const Document = require('../models/Document');

const uploadDocument = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const doc = await Document.create({
        owner: req.user._id,
        title: req.body.title || req.file.originalname,
        fileUrl: req.file.path, 
        fileType: req.file.mimetype,
    });

    res.status(201).json(doc);
};

const getDocuments = async (req, res) => {
    const docs = await Document.find({ owner: req.user._id });
    res.json(docs);
};

const signDocument = async (req, res) => {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
        return res.status(404).json({ message: 'Document not found' });
    }

    if (doc.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    doc.status = 'Signed';
    doc.signature = req.body.signature; 
    await doc.save();
    
    res.json(doc);
};

module.exports = { uploadDocument, getDocuments, signDocument };