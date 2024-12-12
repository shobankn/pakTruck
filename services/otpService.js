
const User = require('../models/usermodel.js');
const {SendotpSchema} = require('../validator/Uservalidator.js');
let transport = require('../middlewares/transporter.js'); 
let {Verification_Email_Template} = require('../middlewares/EmailTemplate.js');


// Send OTP to Gmail
let SendOTPService = async ({ email }) => {
    try {
        if (!email) {
            throw new Error("Email is required to send OTP!");
        }

        let { error } = SendotpSchema.validate({ email });
        if (error) {
            throw new Error(error.message || "Validation failed!");
        }

        let otp = Math.floor(100000 + Math.random() * 900000); 
        let otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        let user = await User.findOne({ email });

        if (user) {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
        } else {
            user = new User({ email, otp, otpExpiry });
        }

        await user.save();

        await transport.sendMail({
            from: process.env.USER_EMAIL,
            to: user.email,
            subject: "Verification OTP Code",
            html: Verification_Email_Template.replace("{verificationCode}", otp)
        });

        return { success: true, message: `OTP sent successfully to ${email}` };
    } catch (error) {
        throw new Error(error.message || "OTP sending failed!");
    }
};

module.exports = {SendOTPService}