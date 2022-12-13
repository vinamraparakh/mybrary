// done
const mongoose = require('mongoose');

const coverImageBasePath = 'uploads/bookCovers'; // This is the folder where the files will be stored - PublicFolder path will be joined later

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, // This is the id of the author object and not the name
        ref: 'Author',
        required: true
    }
});

module.exports = mongoose.model('Book', bookSchema); // Export the model so it can be used in other files.
module.exports.coverImageBasePath = coverImageBasePath;