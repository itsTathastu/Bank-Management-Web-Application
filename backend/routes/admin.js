const express = require('express');
const adminRouter =express.Router();
const Customers = require('../models/customerSchema');
const Transaction = require('../models/transactionSchema');
const Rd = require('../models/rdSchema');
const Collector = require('../models/collectorSchema');
const { MongoClient } = require('mongodb');

function leapyear(year){
    return (year % 100 === 0) ? ( year % 400 === 0) : (year % 4 === 0);
}

const res = {}
var today = new Date();
var date = today.getDate();
var month = today.getMonth()+1;
var year = today.getFullYear();

async function lastTransaction (){
    const client = new MongoClient(process.env.DBurl);
    try{
        // session starts here
        await client.connect();
        const customers = await Customers.find({});
        const admin = await Customers.findOne({customerId: "CUST000"});
        
        customers.forEach(user => {
            var userDate = user.dateCreated[0] + user.dateCreated[1];
            // default penalty is 100
            var penalty = user.penalty;
            var reqAmount = user.monthlyRd + penalty;
            // for dates < 15
            if(date == userDate){
                user.pendingQueue.push(date+month+year);
            }
            if(userDate<'15' && userDate.pendingQueue.length()>0){
                if(date>userDate && user.currentBalance>=reqAmount && date<='16'){
                    func();
                }
                if(date=='17' && user.currentBalance<reqAmount){
                    user.penalty += 100;
                }
            }
            else if(userDate>'15' && userDate.pendingQueue.length()>0){
                if(date>userDate && user.currentBalance>=reqAmount && date>'15'){
                    func();
                }
            }
            else if(userDate=='15' && userDate.pendingQueue.length()>0){
                if(date=='16' && user.currentBalance>=reqAmount){
                    func();
                }
                if(date=='17' && user.currentBalance<reqAmount){
                    user.penalty += 100;
                }
            }
            const func = async () => {  
                var transaction = new Transaction({
                    customerId: user.customerId,
                    collectorId: "admin",
                    transactionAmount: -1.0*reqAmount,
                    currentCustomerBalance: user.currentBalance-reqAmount
                });
                var rdtransaction = new Rd({
                    customerId: user.customerId,
                    collectorId: "admin",
                    transactionAmount: reqAmount,
                    currentCustomerBalance: user.currentBalance-reqAmount,
                    info: user.pendingQueue[0] + " with fine " + user.penalty
                });
                await transaction.save().then(data =>{res['transaction']=data}).catch(err =>{console.log(err);});
                await rdtransaction.save().then(data =>{res['rdTransaction']=data}).catch(err =>{console.log(err);});
                admin.currentBalance += user.penalty;
                user.rdBalance += user.monthlyRd;
                user.currentBalance -= reqAmount;
                Array.prototype.shift(user.pendingQueue);
                user.penalty = 0 ;
                await user.save().then(data =>{res['customer']=data}).catch(err =>{console.log(err);});
                await admin.save().then(data =>{res['admin']=data}).catch(err =>{console.log(err);});
            }
        });
    }
    catch (err){
        console.log(err);
    }
    finally{
        console.log(res);
        await client.close();
    }
}

async function startTransaction (){
    const client = new MongoClient(process.env.DBurl);
    try{
        // session starts here
        await client.connect();
        const customers = await Customers.find({});
        const admin = await Customers.findOne({customerId: "CUST000"});

        customers.forEach(user => {
            var userDate = user.dateCreated[0] + user.dateCreated[1];
            // default penalty is 100
            var penalty = (pendingQueue.length()-1)*100;
            var reqAmount = user.monthlyRd + penalty;
            
            // jan feb mar apr may jun jul aug sep oct nov dec
            // 1   2   3   4   5   6   7   8   9   10  11  12
            // 31  28  31  30  31  30  31  31  30  31  30  31
            if(month == '3' && leapyear(year)){
                if(userDate>'29') user.pendingQueue.push('01'+month+year);
            }
            if(month == '3' && !leapyear(year)){
                if(userDate>'28') user.pendingQueue.push('01'+month+year);
            }
            if(month == '5' && userDate=='31') user.pendingQueue.push('01'+month+year);
            if(month == '10' && userDate=='31') user.pendingQueue.push('01'+month+year);
            if(month == '12' && userDate=='31') user.pendingQueue.push('01'+month+year);

            if(userDate>'15' && userDate.pendingQueue.length()>0){
                if(date>userDate && user.currentBalance>=reqAmount && date>'15'){
                    func();
                }
                else if(date == '01' && user.currentBalance<reqAmount){
                    user.penalty += 100;
                }
            }
            const func = async () => {  
                var transaction = new Transaction({
                    customerId: user.customerId,
                    collectorId: "admin",
                    transactionAmount: -1.0*reqAmount,
                    currentCustomerBalance: user.currentBalance-reqAmount
                });
                var rdtransaction = new Rd({
                    customerId: user.customerId,
                    collectorId: "admin",
                    transactionAmount: reqAmount,
                    currentCustomerBalance: user.currentBalance-reqAmount,
                    info: user.pendingQueue[0] + " with fine " + user.penalty
                });
                await transaction.save().then(data =>{res['transaction']=data}).catch(err =>{console.log(err);});
                await rdtransaction.save().then(data =>{res['rdTransaction']=data}).catch(err =>{console.log(err);});
                admin.currentBalance += user.penalty;
                user.rdBalance += user.monthlyRd;
                user.currentBalance -= reqAmount;
                Array.prototype.shift(user.pendingQueue);
                await user.save().then(data =>{res['customer']=data}).catch(err =>{console.log(err);});
                await admin.save().then(data =>{res['admin']=data}).catch(err =>{console.log(err);});
            }
        });
    }
    catch (err){
        console.log(err);
    }
    finally{
        console.log(res);
        await client.close();
    }
}

//creating a new collector
adminRouter.post('/newcollector', async(req, res)=>{
    try{
        var collector = new Collector({
            collectorId: req.body.collectorId,
            name: req.body.name,
            email: req.body.email,
            password: req.body.email,
            customers: req.body.customers
        });
        try {
            await collector.save();
            res.send(collector);
        } catch (err){
            console.log(err);
            res.status(400).send({message: err});
        }
    }
    catch{
        res.send({message: "error"});
    }
});


adminRouter.get('/lastTransaction', async(req, res)=>{
    await lastTransaction();
    res.send("done");
});

module.exports = {
    adminRouter,
    lastTransaction,
    startTransaction
};