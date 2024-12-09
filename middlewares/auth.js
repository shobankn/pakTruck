
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel.js');

const isAuthenticated = async (req, res, next) => { 
    let token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ error: true, message: "Token is missing" });
    }

    let jwtToken = token.replace('Bearer', '').trim();

    try {
       
        let verify = jwt.verify(jwtToken, process.env.MY_TOKEN_KEY);

        let userdata = await User.findById(verify.userId);
        if (!userdata) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

     
        req.user = {
            userId: userdata._id,
            email: userdata.email,
            accountMode: userdata.accountMode,
            verified: userdata.verified
        };

        req.token = jwtToken;

        next(); 
    } catch (error) {
        console.error(error); 
        return res.status(401).json({ error: true, message: "Invalid or expired token" });
    }
};

module.exports = isAuthenticated;
