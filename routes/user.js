const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const{saveRedirectUrl}=require("../middleware.js");
const flash = require('connect-flash');



 router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
 });

 router.post("/signup",wrapAsync(async(req,res)=>{

   try{ let{username,email,password} = req.body;
   const newUser= new User({email,username});
   const registeredUser = await User.register(newUser, password);

   console.log(registeredUser);
   req.login(registeredUser,(err)=>{
      if(err){
         return next(err);
      }
      req.flash("success","user was registered");
      res.redirect("/listings");
   });
  }
   catch(e){
    req.flash("error","A user with the given username is already register")
    res.redirect("/signup");
   }
}));

router.get("/login",
   (req,res)=>{
    res.render("users/login.ejs");
 });
 router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {  //they are chacke sign in or not
        failureRedirect:"/login",
            failureFlash:true,
        }),
        async(req,res)=>{
            req.flash("success","Welcome Back to Wanderlust! ");
            let redirectUrl = res.locals.redirectUrl  ||"/listings";//jar res.local varti gelatarch java nahitar listing varti ya
            res.redirect(redirectUrl );

 });
 router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    })

 })



module.exports = router;