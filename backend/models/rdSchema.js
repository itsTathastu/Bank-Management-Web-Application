const mongoose = require('mongoose');

const rdSchema = mongoose.Schema({
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
    },
    info: {
        type: String,
        required: true
    }
});

const rd = mongoose.model("rdTransactions", rdSchema);
module.exports = rd;