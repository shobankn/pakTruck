let joi = require('joi');


let SendotpSchema = joi.object({
    email:joi.string().required()
    .email({tlds:{allow:['com','net','org','edu']}})

})
let SignupSchema = joi.object({
    fullname: joi.string(),
    email:joi.string().email({tlds:{allow:['com','net','org','edu']}}),
    password:joi.string().min(8)
     .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$')),
    otp:joi.string().pattern(new RegExp('^\\d{6}$')),

    cnic: joi.string()
        .pattern(new RegExp('^\\d{13}$')) 
        .when('accountMode', { is: 'shop', then: joi.required() }),
    address: joi.string()
        .when('accountMode', { is: 'shop', then: joi.required() })
    

})
let SigninSchema = joi.object({
    email:joi.string().required().email({
        tlds:{allow:['com','net','org','edu']}
    }),
    password:joi.string().required().min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'))


});

let ResetpasswordSchema = joi.object({
    email:joi.string().required().email({tlds:{allow:['com','net','org','edu']}}),
    newpassword:joi.string().required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$')),
    otp:joi.string().pattern(new RegExp('^\\d{6}$'))
})

module.exports = {SendotpSchema,SignupSchema,SigninSchema,ResetpasswordSchema};