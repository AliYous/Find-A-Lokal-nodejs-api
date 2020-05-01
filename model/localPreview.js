const mongoose = require('mongoose');

const localPreviewSchema = new mongoose.Schema({
    local_id: {
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
        min: 4,
        required: true
    },
    hourlyRate: {
        type: Number,
        required: true
    },
    quote: {
        type: String,
        max: 255,
        min: 10,
        required: true
    },
    localImage: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LocalPreview', localPreviewSchema);