
let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    fullname :{
        type:String,
        trim:true,
        required: function () {
            return this.accountMode === 'individual'}
             
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
            return this.verified && this.password
        }
    },
    accountMode:{
        type:String,
        enum:["individual","shop"],
        required: function () {
            return this.verified && this.accountMode
        }

    },

    role:{
        type:String,
        enum:["admin","bayer","seller","user"],
        default:"seller"
  
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
    },

    shopName :{
        type:String,
        trim:true,
        required : function(){
            return this.accountMode === 'shop'
        } 

    },
    
    cnic: {
        type: String,
        required: function () {
            return this.accountMode === "shop";
        }
    },
    address: {
        type: String,
        required: function () {
            return this.accountMode === "shop";
        }
    },

    accountCategory: {
        type: String,
        enum: ["factory", "showroom", "shop"],
        required: function () {
            return this.accountMode === 'shop';
        }
    },


    // ACCOUNT VERIFICATION SCHEMA 
    phone: {
        type: String,
        trim: true,
        unique:true
        },
    
      frontID: {
        type: String,
    
      },
      backID: {
        type: String,
    
      },
      shopPicture: {
        type: String,
      },
      verificationStatus:{
        type: String,
        enum: ['pending', 'approved', 'rejected', 'under_review'],
        default: 'pending',
      },

    //   sign up api with UID 

    Uid : {
        type:String,
        unique: true,
        },


    profilePicture :{
        type:String
    }



},{
    timestamps:true
});

module.exports = mongoose.model('user',userSchema);