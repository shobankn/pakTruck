let joi = require('joi');

let SignupSchema = joi.object({
    fullname: joi.string().required(),
    email:joi.string().required().email({tlds:{allow:['com','net']}}),
    password:joi.string().required().min(8)
     .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$')),
    otp:joi.string().required().pattern(new RegExp('^\\d{6}$')),
    role:joi.string().required()

})

let SigninSchema = joi.object({
    email:joi.string().required().email({
        tlds:{allow:['com','net']}
    }),
    password:joi.string().required().min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'))


})

module.exports = {SignupSchema,SigninSchema};