const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();



//Signup route handler

exports.signup = async (req,res) =>{
    try{
        //get data
        const {name, email, password, role} = req.body;
        //check if user already exist
        
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success: false,
                message:'User already Exists    '
            })
        }

        // secured password

        let hashedPassword;

        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err) {
            return res.status(500).json({
                success:false,
                message:`Error in hasing password`,
            })
        }

        //create entry for User into DB 
        const user = await User.create({
            name, email, password:hashedPassword, role
        })

        return res.status(200).json({
            success:true,
            message:'User Created Sucessfuly',
        });




    }
    catch(error) {
        console.error(error);
        return res.status(500).jason({
            success:false,
            message:'User cannot be registered'
        })

    }
} 



//login
exports.login = async (req,res) => {
    try{
        
        //data fetch
        const {email, passqword} = req.body;
        // validate on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:'Please provide email and password'
            })
        }
        
        //check for registered user
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:'User is not registered'
            })
        }

        const payload = {
            id:user.email,
            id:user._id,
            role:user.role,
        }
        //compare password
       if (await bcrypt.compare(password, user.password)){
                    // password matched
                    const token = jwt.sign(payload, process.env.JWT_SECRET, {
                        expiresIn:'1h'
                    })
                    return res.status(200).json({
                        success:true,
                        message:'User logged in successfully',
                        token:token
                    });
            user.token = token;
            user.password = undefined;
            
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true,
            }
            res.cookie("token",token, options).status(200).json({
                success:true,
                token,
                user,
                message:'user Logged in successfuly',
            });
       }
       else{
        return res.status(401).json({
            success:false,
            message:'Password is incorrect'
        }) 
       }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be logged in'
        })
    }
}   