const express = require('express');
const mongoose = require('mongoose');
const collector = require('./routes/collector');
const cors = require('cors');
const admin = require('./routes/admin').adminRouter;
const user = require('./routes/user');
const nodeCron = require('node-cron');

const app = express();
require('dotenv/config');

mongoose
  .connect(process.env.DBurl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Database connected!");
  })
  .catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use('/collector', collector);
app.use('/admin', admin);
app.use('/user', user);

// per day rdTransactions
nodeCron.schedule('0 0 * * *', async () => {
    await require('./routes/admin').lastTransaction();
});

// last date of month rdTransactions
nodeCron.schedule('0 0 1 * *', async () => {
    await require('./routes/admin').startTransaction();
});

app.get('/', (req, res)=>{
    res.send("Home landing page");
});

app.listen(2000, ()=>{
    console.log("in there");
});