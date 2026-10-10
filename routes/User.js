const express = require("express");
const router = express.Router();


const {login, signup} = require("../Controllers/Auth");
const {auth, isStudent, isAdmin} = require("../middlewares/auth"); 


router.post("/login", login);
router.post("/signup", signup);

//testing Protected routes for single middleware
router.get("/test", auth, (req, res) => {
    res.status(200).json({
        Success: "Welcome to the API",
        message: 'Welcome to the Protected route for test',
    });
});

//Protected Routes

router.get("/Student", auth, isStudent, (req, res) => {
    res.status(200).json({
        Success: "Welcome Student",
        message: 'Welcome to the Procted route for students ',

    });
} );

router.get("/admin", auth, isAdmin, (req, res) => {
    res.status(200).json({
        Success: "Welcome Admin",
        message: 'Welcome to the Protected route for admins ',

    });
} );

module.exports = router;