const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    is_private: {
        type: Boolean,
        default: true,
    },
    brain_id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['processing', 'processed', 'errored'],
    },
    file_type: {
        type: String,
        required: true,
    },
    error_reason: {
        type: String,
        default: null,
    },
    file_sha1: {
        type: String,
        required: true,
    },
    file_size: {
        type: Number,
        required: true,
    },
    chunk_size: {
        type: Number,
        required: true,
    },
    chunk_overlap: {
        type: Number,
        required: true,
    },
    embedding_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
