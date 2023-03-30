const mongoose = require('mongoose');

const transactionSchema= new mongoose.Schema({
    customerId: {
        type: String,
        required: true
    },
    collectorId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    transactionAmount: {
        type: Number,
        required: true
    },
    currentCustomerBalance: {
        type: Number,
        required: true
    }
});

const Members = mongoose.model("Transactions", transactionSchema);
module.exports = Members;