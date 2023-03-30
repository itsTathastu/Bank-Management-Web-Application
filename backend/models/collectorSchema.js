const mongoose = require('mongoose');

const collectorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    collectorId: {
        type: String,
        required: true
    },
    customers: {
        type: Array,
        required: false
    }
});

module.exports = mongoose.model('Collectors', collectorSchema);