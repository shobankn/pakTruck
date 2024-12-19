let joi = require('joi');


// send Email Schema
let SendotpSchema = joi.object({
    email:joi.string().required()
    .email({tlds:{allow:['com','net','org','edu']}})

})

// User Register Schema
let SignupSchema = joi.object({
    fullname: joi.string(),
    email:joi.string().email({tlds:{allow:['com','net','org','edu']}}),
    password:joi.string().min(8)
     .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$')),
     
    otp:joi.string().pattern(new RegExp('^\\d{6}$')),

    shopName: joi.string()
    .when('accountMode', { is: 'shop', then: joi.required() }),

    cnic: joi.string()
        .pattern(new RegExp('^\\d{13}$')) 
        .when('accountMode', { is: 'shop', then: joi.required() }),

    address: joi.string()
        .when('accountMode', { is: 'shop', then: joi.required() }),

        role:joi.string()
        .valid('admin','bayer','seller','user')
        .default('seller'),

        accountCategory:joi.string()
        .valid('factory','showroom','shop')

    })

    // User Login Schema
let SigninSchema = joi.object({
    email:joi.string().required().email({
        tlds:{allow:['com','net','org','edu']}
    }),
    password:joi.string().required().min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'))


});

//  Password Forget Schema
let ResetpasswordSchema = joi.object({
    email:joi.string().required().email({tlds:{allow:['com','net','org','edu']}}),
    newpassword:joi.string().required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$')),
    otp:joi.string().pattern(new RegExp('^\\d{6}$'))
})

let AccountVerifySchema = joi.object({
    phone:joi.string().pattern(/^\d{11}$/),
    
})

module.exports = {SendotpSchema,SignupSchema,SigninSchema,ResetpasswordSchema,AccountVerifySchema};