
let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    fullname :{
        type:String,
        required:[true, "name is require"],
        trim:true
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
        required:[true,"password is requires"],
        minLength:[8, "password required min 8 char"],
        trim:true
    },
    role:{
        type:String,
        enum:["individual","shop"],
        required:true

    },
    otp:{
        type:String,
        required:true,

    },
    VerifyOTP:{
        type:String,
        select:false
    },

    VerifyOTPvlidation:{
        type:String,
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