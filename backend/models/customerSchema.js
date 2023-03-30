const mongoose=require("mongoose");

//Schema
const customerSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    mobile: {
        type: String
    },
    monthlyRd: {
        type: Number,
        required: true
    },
    currentBalance: {
        type: Number,
        required: true
    },
    rdBalance: {
        type: Number,
        required: true
    },
    penalty: {
        type: Number,
    },
    customerId: {
        type: String,
        required: true
    },
    dateCreated: {
        type: String, // format is dd-mm-yyyy
        required: true
    },
    collectorId: {
        type: String,
        required: true
    },
    pendingQueue: {
        type: Array
    }
});

const Customers = mongoose.model("Customers", customerSchema);
module.exports = Customers;