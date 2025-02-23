const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");
const { route } = require("./listing");

router
    .route("/signUp")
    .get((req,res) => {
    res.render("users/signup.ejs")})
    //for signup
    .post(wrapAsync(userController.signupUser)
);


//for login 
router
    .route("/login")
    .get(userController.loginForm)
    .post(
        saveRedirectUrl, 
        passport.authenticate("local",{ 
            failureRedirect: '/login',
            failureFlash: true,
        }),
        userController.login
);

//logout
router.get("/logout", userController.logout)


module.exports = router;