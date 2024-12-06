let jwt = require('jsonwebtoken');
let {SignupSchema,SigninSchema} = require('../middlewares/validator.js');
let User = require('../models/usermodel.js');
let {doHash,doHashValidation} = require('../util/hashing.js');

//  user signup 
let Signup = async(req,res)=>{
    let {fullname,email,password,otp,role} = req.body;

    if(!fullname || !email || !password ||!otp || !role) {
        res.status(400).json({error:true,message:"All fields are required"})
    }
    try {
        let { error} = SignupSchema.validate({fullname,email,password, otp,role});

        if(error) {
            res.status(401).json({error:true,message:error.details[0].message});
        }
        let existUser = await User.findOne({email});

        if(existUser) {
            res.status(401).json({error:true,message:"User already Exist"});
        }

        let hashedPassword = await doHash(password,10);
        
        const newUser = new User({fullname,email,password:hashedPassword,otp,role});
        const result = await newUser.save();
        result.password = undefined;


        res.status(200).json({success:true,message:"Your account has been created successfully"});

        

    }catch(error){
        console.log(error);
        res.status(500).json({error:true,message:"Inrernal Server Error"});
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
                role: existUser.role,
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


module.exports= {Signup,Signin,Signout};