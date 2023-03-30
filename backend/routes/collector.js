const express = require('express');
const { MongoClient } = require('mongodb');
const Collector = require('../models/collectorSchema');
const Transaction = require('../models/transactionSchema');
const Customer = require('../models/customerSchema');
const Rd = require('../models/rdSchema');
const authorization = require('../middlewares/authorization');
const signRouter = express.Router();
require('dotenv/config');
const JWT = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;


signRouter.get('/', (req, res)=>{
    res.send('on collector side');
});

signRouter.post('/login', async(req, res)=>{
    try{
        const collector = await Collector.findOne({email: req.body.email});
        if(!collector) {
            return res.status(400).json({check : false, error : "User does not exist"}) ;
        } 

        const passwordCompare = req.body.password===collector.password;
        if(!passwordCompare) {
            return res.status(400).json({check: false, error : "Please try to login with correct credentials"}) ;
        }
        // res.json({check: true, collector: collector});

        const loggedInCollectorData = {
            collector:{
                id: collector.id 
            }
        }

        const authToken = JWT.sign(loggedInCollectorData, JWT_KEY);
        res.json({check: true, collector: collector, authToken: authToken});

    }
    catch{
        res.send({message: "error"});
    }
});

// creating a new customer
signRouter.post('/newCustomer',authorization, async(req, res)=>{
    try{
        var index = await Customer.count();
        if(index<=9) index = "00"+index;
        else if(index<=99)  index = "0"+index;
        
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        
        if(month<=9)    month="0"+month;
        if(day<=9)  day="0"+day;

        var customer = new Customer({
            customerId: "CUST"+index,
            name: req.body.name,
            address: req.body.address,
            mobile: req.body.mobile,
            currentBalance: 0,
            rdBalance: 0,
            monthlyRd: req.body.monthlyRd,
            dateCreated: `${day}-${month}-${year}`,
            collectorId: req.body.collectorId
        });
        const client = new MongoClient(process.env.DBurl);
        try {
            await client.connect();
            await customer.save();
            const collector = await Collector.findOne({collectorId: req.body.collectorId});
            if(!collector){
                return res.status(400).json({error: "invalid collectorId"});
            }
            collector.customers.push("CUST"+index);
            await collector.save();
            res.send({message: "success"});
        } catch (err){
            console.log(err);
            res.status(400).send({message: err});
        }
        finally {
            await client.close();
        }
    }
    catch{
        res.send({message: "error"});
    }
});

// handling the daily transactions
signRouter.post('/transaction', authorization, async(req, res)=>{
    try{
        //authorise customerid and collectorid
        var customer = await Customer.findOne({customerId: req.body.customerId});
        if(!customer){
            return res.status(400).json({error: "invalid customerId"});
        }
        
        // req will contain each detail from frontend only even the updated currentCustomerBalance
        var transaction = new Transaction({
            customerId: req.body.customerId,
            collectorId: req.body.collectorId,
            transactionAmount: req.body.transactionAmount,
            currentCustomerBalance: req.body.currentCustomerBalance
        });

        //transaction session
        const client = new MongoClient(process.env.DBurl);
        try {
            await client.connect();
            var respondmsg = {}; 
            await transaction.save().then(data =>{respondmsg["transaction"] = data}).catch(err =>{console.log(err);});
            customer.currentBalance += req.body.transactionAmount;
            console.log(customer);
            await customer.save().then(data =>{respondmsg["customer"] = data}).catch(err => {console.log(err)});

            res.send(respondmsg);
        } catch (err){
            console.log(err);
            res.status(400).send({message: err});
        }
        finally {
            await client.close();
        }
    }
    catch{
        res.send({message: "error"});
    }
});

// handling multiple rd transactions
signRouter.post('/manualrdtransaction', authorization, async(req, res)=>{
    // userid, number_of_months
    const client = new MongoClient(process.env.DBurl);
    try {
        await client.connect();
        const customer = await Customer.findById(req.body.customerId);
        const admin = await Customer.findById({collectorId: "CUST000"});
        if(!customer){
            return res.status(400).json({error: "invalid customerId"});
        }
        if(customer.pendingQueue.length < req.body.numberOfMonths){
            return res.status(400).json({error: "invalid number of months"});
        }
        var reqAmount = customer.monthlyRd * req.body.numberOfMonths + customer.penalty;
        customer.rdBalance += customer.monthlyRd * req.body.numberOfMonths;
        
        admin.currentBalance += customer.penalty;
        customer.penalty = 0;
        var rdtransaction = new Rd({
            customerId: user.customerId,
            collectorId: "admin",
            transactionAmount: reqAmount,
            currentCustomerBalance: customer.currentBalance,
            info: customer.pendingQueue[0] + " with fine " + customer.penalty
        });
        await rdtransaction.save().then(data =>{res['rdTransaction']=data}).catch(err =>{console.log(err);});
        await admin.save().then(data =>{res['admin']=data}).catch(err =>{console.log(err);});
        for(var i=0;i<req.body.numberOfMonths;i++){
            customer.pendingQueue.shift();
        }
    } catch (err){
        console.log(err);
        res.status(400).send({message: err});
    }  
});

// profile
signRouter.get('/profile/:id', authorization, async(req, res)=>{
    const id = req.params.id;
    try{
        const collector = await Collector.findOne({collectorId: id});
        if(!collector){
            return res.status(400).json({error: "invalid collectorId"});
        }
        res.json(collector);
    }
    catch (err){
        res.send(err);
    }
});

module.exports = signRouter;