let express = require('express');
let router = express.Router();
let {Signup,Signin, Signout, Forgetpassword, Resetpassword} = require('../controllers/userControll.js');
let{SendOTP} = require('../controllers/sendotp.js');
const isAuthenticated = require('../middlewares/auth.js');


            router.route('/signup').post(Signup);
            router.route('/signin').post(Signin);
            router.route('/signout').post(isAuthenticated,Signout);
            router.route('/sendotp').patch(SendOTP);
            router.route('/forgetpassword').post(Forgetpassword);
            router.route('/resetpassword').post(Resetpassword);

 module.exports = router;