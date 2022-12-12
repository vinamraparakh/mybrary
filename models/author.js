const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('Author', authorSchema); // Export the model so it can be used in other files.
