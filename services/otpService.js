
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
            return res.status(400).json({ error: true, message: "Phone number is required" });
        }

       
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10-minute expiry

     
        let user = await User.findOne({ phone });
        if (!user) {
            user = new User({ phone });
        }

        // Update OTP details
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send OTP via Twilio
        await client.messages.create({
            from: process.env.MOBILE_PHONE,
            to: phone,
            body: `Your verification code is ${otp}`,
        });

        return ({ success: true, message: " Mobile OTP sent successfully" })

    } catch (error) {
        throw new Error(error.message || "Mobile OTP Sending Failed!");
    }
};

// verify mobile otp
let VerifyMobileOTP = async({otp})=>{

    try{
        if(!otp) {
            throw new Error(" otp is required!");
        }
        let user = await User.findOne({otp})

        if(!user) {
            throw new Error("Invalid OTP");
        }

        if(Date.now()> user.otpExpiry) {
            throw new Error("OTP has Expired!")
        }

        user.otp = undefined,
        user.otpExpiry = undefined,
        user.verified = true
        await user.save()

        return({success: true,message:"OTP verified Successfully",user})



    }catch(error) {
        throw new Error(error.message || "mobile OTP sending Failed");
    }

}

module.exports = {SendOTPService,sendOtpMobileService,VerifyMobileOTP}