const mongoose = require('mongoose');

const localSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    localCity: {
        type: String,
        min: 4
    },
    hourlyRate: {
        type: Number
    },
    quote: {
        type: String,
        max: 255,
        min: 10
    },
    languages: {
        type: Array
    },
    aboutMe: {
        type: String,
        min: 50,
        max: 1500
    },
    tourDescription: {
        type: String,
        min: 50,
        max: 1500
    },
    localImage: {
        type: String
    },
    profile_isComplete: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Local', localSchema);