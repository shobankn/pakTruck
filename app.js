let express = require('express');
let dotenv = require('dotenv').config({path:'./config/.env'});
let cookieparser = require('cookie-parser');
let helmet = require('helmet');
let Databaseconnection = require('./config/mongoosecon.js');
let router = require('./routers/userRoute.js');
let app  = express();


Databaseconnection();
app.use(express.json());
app.use(cookieparser());
app.use(helmet());
app.use(express.urlencoded({extended:true}));

// API
app.use('/api',router);

app.listen(process.env.PORT,(error)=>{
    if(error) throw error;
    console.log(`PORT IS LISTING ON ${process.env.PORT}`);
})
