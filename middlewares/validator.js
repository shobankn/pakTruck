let joi = require('joi');

let SignupSchema = joi.object({
    fullname: joi.string(),
    email:joi.string().email({tlds:{allow:['com','net']}}),
    password:joi.string().min(8)
     .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$')),
    otp:joi.string().pattern(new RegExp('^\\d{6}$')),
    role:joi.string()

})

let SigninSchema = joi.object({
    email:joi.string().required().email({
        tlds:{allow:['com','net']}
    }),
    password:joi.string().required().min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'))


});

let ResetpasswordSchema = joi.object({
    email:joi.string().required().email({tlds:{allow:['com','net']}}),
    newpassword:joi.string().required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$')),
    otp:joi.string().pattern(new RegExp('^\\d{6}$'))
})

module.exports = {SignupSchema,SigninSchema,ResetpasswordSchema};