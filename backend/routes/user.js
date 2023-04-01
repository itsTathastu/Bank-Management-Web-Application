const express = require('express');
const Transaction = require('../models/transactionSchema');
const Customer = require('../models/customerSchema');
const Rd = require('../models/rdSchema');
const userRouter = express.Router();

require('dotenv/config');

userRouter.get('/', (req, res)=>{
    res.send('on user side');
});

// date format is yyyy-mm-dd
userRouter.get('/rdstatement', async(req, res)=>{
    try{
        const user = await Customer.find({customerId: req.body.customerId});
        if(!user) {
            return res.status(400).json({check : false, error : "User does not exist"}) ;
        }
        const rd = await Rd.find({customerId: req.body.customerId, date : {$gte: req.body.startDate, $lte: req.body.endDate}});
        res.send({user, rd});
    }
    catch{
        res.send({message: "error"});
    }
});

// date format is yyyy-mm-dd
userRouter.get('/statement', async(req, res)=>{
    try{
        const user = await Customer.find({customerId: req.body.customerId});
        if(!user) {
            return res.status(400).json({check : false, error : "User does not exist"}) ;
        }
        const transaction = await Transaction.find({customerId: req.body.customerId, date : {$gte: req.body.startDate, $lte: req.body.endDate}});
        res.send({user, transaction});
    }
    catch{
        res.send({message: "error"});
    }
});

userRouter.get('/profile/:id', async(req, res)=>{
    const id = req.params.id;
    try{
        const user = await Customer.findOne({customerId: id});
        if(!user) {
            return res.status(400).json({check : false, error : "User does not exist"}) ;
        }
        res.send(user);
    }
    catch{
        res.send({message: "error"});
    }
});

module.exports = userRouter;