
let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    fullname :{
        type:String,
        trim:true,
        required: function () {
            return this.verified;}
    },
    email:{
        type:String,
        require:[true,"email is required"],
        trim:true,
        unique:[true,"email must be unique"],
        minLength:[5,"email must have char"],
        lowercase:true
    },
    password:{
        type:String,
        minLength:[8, "password required min 8 char"],
        trim:true,
        required: function () {
            return this.verified;}
    },
    role:{
        type:String,
        enum:["individual","shop"],
        required: function () {
            return this.verified;}

    },
    otp:{
        type:String
       

    },
   
    otpExpiry:{
        type:Date,
        select:false
    },
    
    verified:{
        type:Boolean,
        default:false
    }


},{
    timestamps:true
});

module.exports = mongoose.model('user',userSchema);