
let twilio = require('twilio');
let {generateUID,doHash} = require('../util/hashing.js')
const User = require('../models/usermodel.js');
let sharp  = require('sharp');
let fs = require('fs');
const {SendotpSchema,SignupSchema} = require('../validator/Uservalidator.js');
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

// send OTP with uid
const SendOTPwithUidService = async ({ email }) => {
    try {
        if (!email) {
            throw new Error("Email is required to send OTP!");
        }

       
        const { error } = SendotpSchema.validate({ email });
        if (error) {
            throw new Error(error.message || "Validation failed!");
        }

        // Check if the email is already registered
        let user = await User.findOne({ email });
        if (user) {
            throw new Error("Email is already registered!");
        }

        // Generate a 6-digit OTP and set expiry time
        const otp = Math.floor(100000 + Math.random() * 900000); 
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

        
        const uid = generateUID(); // Generate a unique ID
        user = new User({ email, otp, otpExpiry, Uid: uid });

        await user.save(); 

        // Send OTP 
        await transport.sendMail({
            from: process.env.USER_EMAIL,
            to: user.email,
            subject: "Verification OTP Code",
            html: Verification_Email_Template.replace("{verificationCode}", `OTP:${otp}   UID:${uid}`)

        });

        return { success: true, message: `OTP sent successfully to ${email}`, uid };
    } catch (error) {
        throw new Error(error.message || "OTP sending failed!");
    }
};

// verify email otp
let VerifyEmailOTP = async({otp})=>{

    try{
        if(!otp) {
            throw new Error(" otp is required!");
        }
        let user = await User.findOne({otp})

        let{error} = SignupSchema.validate({otp});
        if(error) throw new Error(error.message || "validation failed");

        if(!user) {
            throw new Error("Invalid OTP");
        }

        if(Date.now()> user.otpExpiry) {
            throw new Error("OTP has Expired!")
        }

        user.otp = undefined,
        user.otpExpiry = undefined,
        await user.save()

        return({success: true,message:"OTP verified Successfully",user})



    }catch(error) {
        throw new Error(error.message || " OTP sending Failed");
    }

}

// user signup API with UID
// Function to process images with Sharp
let  processImage = async (filePath) => {
    const enhancedPath = filePath.replace(/(\.[a-z]+)$/, '-enhanced$1');
  
    await sharp(filePath)
      .resize(800, 800, { fit: 'inside' })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(enhancedPath);
  
    try {
      await fs.unlinkSync(filePath); 
      console.log(`File deleted successfully: ${filePath}`);
    } catch (err) {
      console.error(`Failed to delete file: ${filePath}`, err);
    }
  
    return enhancedPath;
  }
  
  // Account sign up 
  const SignupWithUidService = async (data, files) => {
    const { fullname, password, cnic, Uid } = data;
  
    if (!fullname || !password || !cnic || !Uid) {
      throw new Error('All fields are required: Full Name, Password, CNIC, and UID.');
    }

    let {error} = SignupSchema.validate({fullname,password,cnic});
    if(error) throw new Error(error.message || "validation failed!");

  
    const existingUser = await User.findOne({ Uid });
    if (!existingUser) {
      throw new Error('Invalid UID. Please check your details and try again.');
    }
  
    if(existingUser.verified) {
        throw new Error('Already Verified Account')
    }
    
    const profilePicture = files?.profile?.[0];
    if (!profilePicture) {
      throw new Error('Profile picture upload is required.');
    }
  
    const isValidFile = (file) =>
      file && typeof file.mimetype === "string" &&
      (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf");
  
    if (!isValidFile(profilePicture)) {
      throw new Error('Profile picture must be an image or PDF file.');
    }
  
    const profilePicturePath = profilePicture.mimetype.startsWith('image/')
      ? await processImage(profilePicture.path)
      : profilePicture.path;
  
    const doHashedpassword = await doHash(password, 10);
  
    existingUser.fullname = fullname;
    existingUser.password = doHashedpassword;
    existingUser.cnic = cnic;
    existingUser.profilePicture = profilePicturePath;
    existingUser.verified = true;
  
    await existingUser.save();
  
    return { message: 'User Account Has Been Created Successfully', existingUser };
  };
  
module.exports = {SendOTPService,sendOtpMobileService,VerifyMobileOTP,SendOTPwithUidService,VerifyEmailOTP,SignupWithUidService}