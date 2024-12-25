let express = require('express');
let router = express.Router();
let {Signup,Signin, Signout, Forgetpassword, Resetpassword} = require('../controllers/userControll.js');
let{SendOTP, SendOTPMobile,MobileOTP,SendOTPwithUid,verifyUserEmailOtp,SignupWithUid} = require('../controllers/otpControll.js')
const {isAuthenticated,authorizeRole} = require('../middlewares/auth.js');
let {Admin,Bayer,Seller,User} = require('../controllers/adminControll.js');
let {VerifyIndividual,VerifyShop} = require('../controllers/accountVerifyControll.js');
let {uploadForIndividual,uploadForShop,uploadProfile} = require('../middlewares/multerUpload.js');




            router.route('/signup').post(Signup);
            router.route('/signin').post(Signin);
            router.route('/signout').post(isAuthenticated,Signout);
            router.route('/sendotp').patch(SendOTP);
            router.route('/forgetpassword').post(Forgetpassword);
            router.route('/resetpassword').post(Resetpassword);
            router.route('/admin').get(isAuthenticated,authorizeRole("admin"),Admin);
            router.route('/bayer').get(isAuthenticated,authorizeRole("bayer","admin"),Bayer);
            router.route('/seller').get(isAuthenticated,authorizeRole('seller'),Seller);
            router.route('/user').get(isAuthenticated,authorizeRole('user',"seller","admin"),User);
            router.route('/mobileotp').post(SendOTPMobile);
            router.route('/verifymobileotp').post(MobileOTP);
            router.route('/verify/individual').post(uploadForIndividual,VerifyIndividual);
            router.route('/verify/shop').post(uploadForShop,VerifyShop);
            router.route('/sendotpwithuid').post(SendOTPwithUid);
            router.route('/verifyemailotp').post(verifyUserEmailOtp);
            router.route('/signupwithuid').post(uploadProfile,SignupWithUid);


 module.exports = router;