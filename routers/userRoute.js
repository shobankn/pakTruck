let express = require('express');
let router = express.Router();
let {Signup,Signin, Signout, Forgetpassword, Resetpassword} = require('../controllers/userControll.js');
let{SendOTP} = require('../controllers/otpControll.js')
const {isAuthenticated,authorizeRole} = require('../middlewares/auth.js');
let {Admin,Bayer,Seller,User} = require('../controllers/adminControll.js');


            router.route('/signup').post(Signup);
            router.route('/signin').post(Signin);
            router.route('/signout').post(isAuthenticated,Signout);
            router.route('/sendotp').patch(SendOTP);
            router.route('/forgetpassword').post(Forgetpassword);
            router.route('/resetpassword').post(Resetpassword);
            router.route('/admin').get(isAuthenticated,authorizeRole("admin"),Admin);
            router.route('/bayer').get(isAuthenticated,authorizeRole("bayer","admin"),Bayer);
            router.route('/seller').get(isAuthenticated,authorizeRole('seller'),Seller);
            router.route('/user').get(isAuthenticated,authorizeRole('user'),User);

 module.exports = router;