
let {
    SendOTPService,
    sendOtpMobileService,
    VerifyMobileOTP,
    SendOTPwithUidService,
    VerifyEmailOTP,
    SignupWithUidService
} = require('../services/otpService.js');


// Send  OTP to Email
const SendOTP = async (req, res) => {
    try {
        let result = await SendOTPService(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: true, message: error.message || "Internal Server Error" });
    }
};

// send otp to mobile
const SendOTPMobile = (req,res)=>{
    try{
        let result = sendOtpMobileService(req.body);
        res.status(200).json(result);

    }catch(error){
        res.status(500).json({error:true,message:error.message|| "internal server Error"});
    }
}
// verify Mobile OTP
const MobileOTP = async(req,res) => {
    try{
        let {otp} = req.body;
        let result = await VerifyMobileOTP({otp});
        res.status(200).json(result);

    }catch(error) {
        res.status(500).json({error:true,message: error.message});
    }
}


// send email otp with UID
const SendOTPwithUid = async (req, res) => {
    try {
        let result = await SendOTPwithUidService(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: true, message: error.message || "Internal Server Error" });
    }
};

// verify otp 
const verifyUserEmailOtp = async(req,res) => {
    try{
        let {otp} = req.body;
        let result = await VerifyEmailOTP({otp});
        res.status(200).json(result);

    }catch(error) {
        res.status(500).json({error:true,message: error.message});
    }
}

// signb up with Uid 
let SignupWithUid = async(req,res)=>{
    try {
        const result = await SignupWithUidService(req.body, req.files);
        res.status(200).json(result);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
}

module.exports = {SendOTP,SendOTPMobile,MobileOTP,SendOTPwithUid,verifyUserEmailOtp,SignupWithUid};






