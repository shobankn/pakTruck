
let twilio = require('twilio');
const User = require('../models/usermodel.js');
const {SendotpSchema} = require('../validator/Uservalidator.js');
let transport = require('../middlewares/transporter.js'); 
let {Verification_Email_Template} = require('../middlewares/EmailTemplate.js');

let accountSid = process.env.ACCOUNT_SID;
let authToken = process.env.AUTH_TOKEN;
let client = twilio(accountSid,authToken);

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

// send OTP on Mobile
let sendOtpMobileService = async({ phone }) => {
    try {
        if (!phone) {
            throw new Error("Phone Number is Required!");
        }
        
        
        // Check if user already exists
        let user = await User.findOne({ phone });
        if (user) {
            throw new Error("Phone Number is Already Exists!");
        }

        // Generate OTP and expiry
        let otp = Math.floor(100000 + Math.random() * 900000).toString();
        let otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

        // Save OTP details in database
        user = new User({ phone, otp, otpExpiry });
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send OTP via Twilio
        await client.messages.create({
            from: process.env.MOBILE_PHONE,  
            to:phone,
            body: `Verification code is ${otp}`
        });

        return { success: true, message: "OTP is sent to mobile phone" };

    } catch (error) {
        throw new Error(error.message || "Mobile OTP Sending Failed!");
    }
};


module.exports = {SendOTPService,sendOtpMobileService}