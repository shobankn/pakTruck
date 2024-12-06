let express = require('express');
let dotenv = require('dotenv');
let cookieparser = require('cookie-parser');
let helmet = require('helmet');
let Databaseconnection = require('./mongoosecon');
let router = require('./routers/userRoute.js');
let app  = express();

dotenv.config({path:".env"});
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
