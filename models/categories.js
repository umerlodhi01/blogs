const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const categorySchema = new Schema({
    category: {
        type: String,
        required: 'Category is Required',

    },
   
});


module.exports = mongoose.model('Category', categorySchema );