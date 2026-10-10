//  auth, isStudents, isAdmin


const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try{
        // extract JWT token
        //Pending : other ways to fetch token
        const token = req.body.token;
        
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'Token Missing'
            });
        }

        //verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Token", decode);
            req.user = decode;
            next();
        } catch(error){
            return res.status(401).json({
                success:false,
                message:'Invalid Token'
            });
        }
        next(); 
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong'
        });
    }
}


exports.isStudent = (req, res, next) => {
    try{
        if(req.user.role !== "student") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for students only'
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong'
        });    
    }
}

exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.role !== "admin") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for admins only'
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went wrong'
        });    
    }
}