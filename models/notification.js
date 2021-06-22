const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const notificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: 'Description is Required',
    },
    date: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('Notification', notificationSchema);