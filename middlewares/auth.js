
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel.js');

const isAuthenticated = async (req, res, next) => { 
    let token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ error: true, message: "Token is missing please Log in" });
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
            verified: userdata.verified,
            role: userdata.role
        };

        req.token = jwtToken;

        next(); 
    } catch (error) {
        console.error(error); 
        return res.status(401).json({ error: true, message: "Invalid or expired token" });
    }
};

// To Authorized the roles
const authorizeRole = (...roles) => {
    return (req, res, next) => {
        try {
            
            if (!req.user) {
                return res.status(401).json({
                    error: true,
                    message: "You are not authorized. Please Log in!",
                });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    error: true,
                    message: `Access denied. Required one of these roles: ${roles.join(', ')}`,
                });
            }

            next();
        } catch (error) {
            
            res.status(500).json({
                error: true,
                message: " Authorization error!.",
                details: error.message,
            });
        }
    };
};


module.exports = {isAuthenticated,authorizeRole}