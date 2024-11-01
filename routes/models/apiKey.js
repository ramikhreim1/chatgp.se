const mongoose = require('mongoose');
const { Schema } = mongoose;

// API Key collection schema
const apiKeySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    },
    services: [{
        name: {
            type: String,
            required: true
        },
        scope: {
            type: String, // Basic, Standard, Premium
            enum: ['Basic', 'Standard', 'Premium'],
            default:'Basic',
            required: true
        },
        permissions: [String]
    }],
    expiration: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    revokedAt: {
        type: Date,
        default: null
    },
    ipValidating: {
        type: Boolean,
        default: true
    },
    ipWhitelist: [String]
});

const APIKey = mongoose.model('APIKey', apiKeySchema);
module.exports = APIKey
