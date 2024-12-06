
let User = require('../models/usermodel.js');
let transport = require('../middlewares/transporter.js');
let{Verification_Email_Template} = require('../middlewares/EmailTemplate.js');
let {hmacProcess} = require('../util/hashing.js');

// Send OTP
const SendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required to send OTP" });
    }

    try {
        const user = await User.findOne({ email });

        if (user && user.verified) {
            return res.status(409).json({ error: true, message: "User is already registered and verified" });
        }

        const codevalue = Math.floor(100000 + Math.random() * 900000).toString();

        const info = await transport.sendMail({
            from: process.env.USER_EMAIL,
            to: user.email,
            subject: "Email Verification Code",
            html: Verification_Email_Template.replace('{verificationCode}', codevalue),
        });

        if (info.accepted.includes(user.email)) {
            const hashedOTP = hmacProcess(codevalue, process.env.HMAC_SECRET_KEY);
            user.VerifyOTP = hashedOTP; // Save hashed OTP to user document
            user.VerifyOTPValidation = Date.now(); // Save current time for validation
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Verification code has been sent to your email",
            });
        }

        return res.status(500).json({
            error: true,
            message: "Failed to send verification code",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Something went wrong",
            details: error.message
        });
    }
};

module.exports = { SendOTP };
