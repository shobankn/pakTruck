
let {SendOTPService} = require('../services/otpService.js');;


const SendOTP = async (req, res) => {
    try {
        let result = await SendOTPService(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: true, message: error.message || "Internal Server Error" });
    }
};



module.exports = { SendOTP };






