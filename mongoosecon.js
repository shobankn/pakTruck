let mongoose = require('mongoose');

let Databaseconnection = ()=>{
    try{
        mongoose.connect(process.env.MONGODB_URL)
        .then(()=>{ console.log("Mongodb Connection Is  Established")})
        .catch((error)=> console.log(error));

    }catch(error){
        console.log(error);
    }
}
module.exports = Databaseconnection;