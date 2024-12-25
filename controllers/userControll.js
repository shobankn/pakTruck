
let {SignupService,SigninService,ForgetPasswordService,ResetpasswordService} = require('../services/userService.js');

        //  Sign up API
        let Signup = async(req,res)=>{
            try{
                let response = await SignupService(req.body);
                res.status(200).json(response)

            }catch(error) {
                console.log(error)
                res.status(500).json({error:true,message:error.message});
            }
        }


        // user Sign in 
        const Signin = async (req, res) => {
            try {
            const result = await SigninService( req.body);

                res.cookie('Authorization', `Bearer ${result.token}`, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    expires: new Date(Date.now() + 8 * 3600000),
                });

                return res.status(200).json({
                    success: true,
                    message: "Login successful.",
                    token: result.token,
                });
            } catch (error) {
                console.error("Error during Signin:", error);
                res.status(500).json({ error: true, message: error.message });
            }
        };


        //     const { email, password } = req.body;

        //     if (!email || !password) {
        //         return res.status(400).json({ error: true, message: "All fields are required." });
        //     }

        //     try {
                
        //         const { error } = SigninSchema.validate({ email, password });
        //         if (error) {
        //             return res.status(400).json({ error: true, message: error.details[0].message });
        //         }

            
        //         const existUser = await User.findOne({ email }).select('+password');
        //         if (!existUser) {
        //             return res.status(404).json({ error: true, message: "User does not exist." });
        //         }

                
        //         const isPasswordValid = await doHashValidation(password, existUser.password);
        //         if (!isPasswordValid) {
        //             return res.status(401).json({ error: true, message: "Invalid credentials." });
        //         }

            
        //         const token = jwt.sign(
        //             {
        //                 userId: existUser._id,
        //                 email: existUser.email,
        //                 accountMode: existUser.accountMode,
        //                 verified: existUser.verified,
        //             },
        //             process.env.MY_TOKEN_KEY,
        //             { expiresIn: '5h' }
        //         );

            
        //         res.cookie('Authorization', `Bearer ${token}`, {
        //             httpOnly: true,
        //             secure: process.env.NODE_ENV === 'production', 
        //             sameSite: 'strict',
        //             expires: new Date(Date.now() + 8 * 3600000), 
        //         });

        //         return res.status(200).json({
        //             success: true,
        //             message: "Login successful.",
        //             token
        //         });

        //     } catch (error) {
        //         console.error("Error during Signin:", error); 
        //         return res.status(500).json({ error: true, message: "Internal server error." });
        //     }
        // };

        // sign out 

        const Signout = async(req,res)=>{
            res.clearCookie('Authorization')
            res.status(200).json({success:true,message:"Log Out Successflluy"})
        }

        // forget password
        const Forgetpassword = async(req,res)=>{
            try{
            let result = await ForgetPasswordService (req.body);
            res.status(200).json(result); 
            }catch(error) {
                res.status(500).json({error:true,message:"Internal Server Error"})
            }

            
        }

        // verify otp to reset passwo
        let Resetpassword = async(req,res)=>{
            try{
            let result = await ResetpasswordService(req.body);
            res.status(200).json(result);
            }catch(error){
                res.status(500).json({error:true,message:" Internal Server Error"});
            }
        }


        







module.exports= {Signup,Signin,Signout,Forgetpassword,Resetpassword};