const jwt = require('jsonwebtoken');
const {SignupSchema,SigninSchema,ResetpasswordSchema,SendotpSchema} = require('../validator/Uservalidator.js');
const User = require('../models/usermodel.js');
const {doHash,doHashValidation} = require('../util/hashing.js');
const transport = require('../middlewares/transporter.js');
const {Welcome_Email_Template,Forget_Password_Template,password_Reset_Successfully_Template,Verification_Email_Template} = require('../middlewares/EmailTemplate.js');





// Register Service
let SignupService = async({ fullname, email, password, otp, accountMode,shopName,cnic, address,role })=> {

    try{
        if(  !email || !password || !otp || !accountMode||!role) {
            throw new Error("All Fields Are Required");
        }

        let {error}  = SignupSchema.validate({fullname,email,password,otp,shopName,cnic,address}) 

        if(error) {
            throw new Error(error.message || "Validation Error");
                }

            let user = await User.findOne({email})

            if(!user) {
                throw new Error("To Register your self please send otp first!")
            }
            
            if(user.otp !== otp || user.otpExpiry < new Date()) {
                throw new Error(" Invalid OR Expired OTP")
            }
            if(user.verified) {
                throw new Error('User account already verified!');
            }
           

            let hashedpassword = await doHash(password,10);

            user.fullname = fullname,
            user.email = email,
            user.password = hashedpassword,
            user.accountMode = accountMode,
            user.otp = undefined,
            user.otpExpiry = undefined,
            user.verified = true,
            user.role = role || 'seller'

            if(accountMode === "shop") {
                user.shopName = shopName,
                user.cnic = cnic,
                user.address = address
            }
            await user.save();
            await transport.sendMail({
                from:process.env.USER_EMAIL,
                to: email,
                subject: "WELL COME",
                html : Welcome_Email_Template.replace('{name}',user.fullname)

            })
            return {success:true,message:" User Account Has Been Created and Verified Successfully"}
        

    }catch(error){
        console.log(error);
        throw new Error(error.message || "An Error Accurred During Signup Account")
    }
}

// Log in service
const SigninService = async ({ email, password }) => {
    try {

        if (!email || !password) {
            return res.status(400).json({ error: true, message: "All fields are required!" });
        }
        const { error } = SigninSchema.validate({ email, password });
        if (error) {
            throw new Error(error.message || "Validation error");
        }

    
        const existUser = await User.findOne({ email }).select('+password');
        if (!existUser) {
            throw new Error("User does not exist.");
        }

    
        const isPasswordValid = await doHashValidation(password, existUser.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials.");
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

        return { token };
    } catch (error) {
        console.error("Error during Signin:", error);
        throw new Error(error.message || "Internal server error.");
    }
};
// forget password
const ForgetPasswordService = async({email})=>{
    try{
        if (!email) {
            throw new Error("Email is required")
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error( "User not found" );
        }

    
        const otp  = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        
        await transport.sendMail({
            from: process.env.USER_EMAIL,
            to:email,
            subject: 'Reset Password OTP',
            html: Forget_Password_Template.replace('{verificationCode}',otp)
        });

        return {success:true, message:`Password Reset OTP sent successfully to ${email}`}

    }catch(error){
        throw new Error(error.message || "Email not not!")
    }

}
// reset password
const  ResetpasswordService = async({email,otp,newpassword})=> {
    try{
        if(!email || !otp || !newpassword) {
            throw new Error('All fields are required')
        }
        let {error} = ResetpasswordSchema.validate({email,otp,newpassword})
        if(error) {
            throw new Error(error.message || "Validation Failed Error!")
        }

        let existUser = await User.findOne({email});
        if(!existUser) {
            throw new Error("User Does Not Found!")
        }

        if(existUser.otp !== otp || existUser.otpExpiry < new Date()) {
            throw new Error("Invalid or Expired OTP!")

        }
        let hashedPassword = await doHash(newpassword,10);

        existUser.password = hashedPassword,
        existUser.otp = undefined,
        existUser.otpExpiry = undefined,
        await existUser.save();
        await transport.sendMail({
            from:process.env.USER_EMAIL,
            to:existUser.email,
            subject:"PASSWORD RESET SUCCESSFULLY",
            html:password_Reset_Successfully_Template
        })
        return {success:true, message:"Password reset successfully"}

    }catch(error){
        throw new Error(error.message || "password not reset");
    }
}


   
module.exports = {SignupService,SigninService,ForgetPasswordService,ResetpasswordService}