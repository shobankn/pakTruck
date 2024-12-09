let jwt = require('jsonwebtoken');
let {SignupSchema,SigninSchema, ResetpasswordSchema} = require('../middlewares/validator.js');
let User = require('../models/usermodel.js');
let transport = require('../middlewares/transporter.js');
let {Welcome_Email_Template,Forget_Password_Template,password_Reset_Successfully_Template} = require('../middlewares/EmailTemplate.js');
let {doHash,doHashValidation} = require('../util/hashing.js');

//  user signup 
let Signup = async (req, res) => {
    const { fullname, email, password, otp, accountMode,cnic, address } = req.body; 

    if (!fullname || !email || !password ||!otp|| !accountMode ) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    try {
        let {error} = SignupSchema.validate({fullname,email,password,otp,cnic,address});
        if(error) {
            return res.status(400).json({ error: true, message: error.details[0].message });

        }
        const user = await User.findOne({ email });
       
        if (!user) return res.status(400).json({ error: true, message: "To register yourself please send otp first" });

        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ error: true, message: "Invalid or expired OTP" });
        }

        const hashedPassword = await doHash(password, 10);

        user.fullname = fullname;
        user.password = hashedPassword;
        user.accountMode = accountMode;
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.verified = true;

        if(accountMode === 'shop') {
            user.cnic = cnic;
            user.address = address;
        }

        await user.save();
        await transport.sendMail({
            from:process.env.USER_EMAIL,
            to:user.email,
            subject:"WELL COME",
            html:Welcome_Email_Template.replace('{name}',user.fullname,)
        })

        res.status(200).json({ success: true, message: "User account has been created and verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}


// user Log in
const Signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required." });
    }

    try {
        
        const { error } = SigninSchema.validate({ email, password });
        if (error) {
            return res.status(400).json({ error: true, message: error.details[0].message });
        }

    
        const existUser = await User.findOne({ email }).select('+password');
        if (!existUser) {
            return res.status(404).json({ error: true, message: "User does not exist." });
        }

        
        const isPasswordValid = await doHashValidation(password, existUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: true, message: "Invalid credentials." });
        }

    
        const token = jwt.sign(
            {
                userId: existUser._id,
                email: existUser.email,
                accountMode: existUser.accountMode,
                verified: existUser.verified,
            },
            process.env.MY_TOKEN_KEY,
            { expiresIn: '5h' }
        );

    
        res.cookie('Authorization', `Bearer ${token}`, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            expires: new Date(Date.now() + 8 * 3600000), 
        });

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token
        });

    } catch (error) {
        console.error("Error during Signin:", error); 
        return res.status(500).json({ error: true, message: "Internal server error." });
    }
};

// sign out 
const Signout = async(req,res)=>{
    res.clearCookie('Authorization')
    res.status(200).json({success:true,message:"Log Out Successflluy"})
}

// forget password

let Forgetpassword =  async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    try {
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: true, message: "User not found" });
        }

    
        const otp  = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        
        await transport.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'Reset Password OTP',
            html: Forget_Password_Template.replace('{verificationCode}',otp)
        });

        res.status(200).json({ success: true, message:  `Password Reset OTP sent successfully to ${email}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}

// verify otp to reset password
const Resetpassword =  async (req, res) => {
    const { email, otp, newpassword } = req.body;

    if (!email || !otp || !newpassword) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    try {
        let {error} = ResetpasswordSchema.validate({email,otp,newpassword});
        if(error) {
            return res.status(400).json({ error: true, message:error.details[0].message });

        }
       
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: true, message: "User not found" });
        }

        
        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ error: true, message: "Invalid OTP or OTP expired" });
        }

        
        const hashedPassword = await doHash(newpassword, 10);

        
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        await transport.sendMail({
            from: process.env.USER_EMAIL,
            to:email,
            subject:"PASSWORD RESET SUCCESSFULLY",
            html:password_Reset_Successfully_Template
        })

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
} 





module.exports= {Signup,Signin,Signout,Forgetpassword,Resetpassword};