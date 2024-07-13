 if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
 }
 
 const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path"); // view folder path
const methodOverride = require("method-override"); // for form edit
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session"); // requiring express-session
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Import User model correctly
const User = require("./models/user.js");

// Routes
const listingsRouter = require("./routes/listing.js"); // route for listing
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// MongoDB connection
// const mongo = "mongodb://127.0.0.1:27017/Myproject";

const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

// Set up EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
 });

 store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE")
 })
// Session configuration
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


   
 


app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// // Test route for user registration
// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "sanket@gmail.com",
//         username: "sanket wakshe"
//     });
//     let registeredUser = await User.register(fakeUser, "hellowworld");
//     res.send(registeredUser);
// });

// Use routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews/", reviewsRouter);
app.use("/",userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start server
app.listen(8080, () => {
    console.log("server is working");
});
