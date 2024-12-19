
let {SendOTPService,sendOtpMobileService,VerifyMobileOTP} = require('../services/otpService.js');

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


module.exports = {SendOTP,SendOTPMobile,MobileOTP};






