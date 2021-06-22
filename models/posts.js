const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    title: {
        type: String,
        required: 'Title is Required',
    },
    status: {
        type: String,
        default: 'public',
    },
    allowComments: {
        type: Boolean,
    },
    image: {
        type: String,
        required: 'Image is Required',
    },
    description: {
        type: String,
        required: 'Description is Required',
    },
    date: {
        type: Date,
        default: Date.now()
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = mongoose.model('Post', postSchema);