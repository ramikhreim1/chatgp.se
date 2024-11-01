const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    sender: {
        type: String,
        default: 'GPT',
        required: true
    },
    images: [{
        url: String,
        public_id: String
    }],
    references: [String],
    recipient: {
        type: String,
        default: 'GPT',
        required: true
    },
    text: { type: String, default: "" },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: String,
    name: {
        type: String,
        default: "New chat"
    },
    messages: [messageSchema]
}, { timestamps: true });

chatSchema.methods.addMessage = async function ({ sender, recipient, text }) {
    const message = new Message({
        sender: sender,
        recipient: recipient,
        text: text
    });

    this.messages.push(message);
}
const Message = mongoose.model('Message', messageSchema);
module.exports = Message


module.exports = mongoose.model('Chat', chatSchema);
