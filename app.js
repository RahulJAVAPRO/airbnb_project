if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; //mongo connect k liye url

const dbUrl = process.env.ATLASDB_URI; // that is connect to cloud for hosting

const methodeOverride = require("method-override");

const ejsMate = require("ejs-mate");
const session = require("express-session"); // session for cookies
const MongoStore = require("connect-mongo"); 
const flash = require("connect-flash"); //flash Message
const passport = require("passport")//passport
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const path = require("path");
const listingsRouter = require("./routes/listing.js") // for routes listing.js
const reviewsRouter = require("./routes/review.js");//for reoutes reviews.js
const userRouter = require("./routes/user.js");

app.use(cookieParser("secretcode"));  // if is used signed to we up on breket any messae like this is orignal
app.set("views engine", "ejs"); //views folder
app.set("views", path.join(__dirname, "views")); // join ke liye
app.engine("ejs", ejsMate); //boilerplate k liye
app.use(express.static(path.join(__dirname, "/public"))); //css public folder
app.use(express.urlencoded({extended: true})); //update kerne k liye
app.use(methodeOverride("_method")); //method-overide use

main().then(() => {
    console.log("conected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
})

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
})

//sessions

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,

    //expairi data
    cookie: {
        express: Date.now() + 7 * 24 * 60 * 60 * 1000, // expeiri date
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, 
    }
}

// app.get("/", (req,res) => {
//     res.send("hi, I am local root");
// })


//middleware of flash and sessions
app.use(session(sessionOptions));
app.use(flash());

//for passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//this is for flash message 
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//for possport checking 

// app.get("/demouser", async (req,res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "sigma-student",
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })


app.use("/listings", listingsRouter) //that is only one line handle routes listings
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


//if all route is not exits without include route

app.all("*",(req,res,next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//middlware
app.use((err,req,res,next) => {
    let {statusCode = 500, message = "Something Went Wrong"} = err;
    res.status(statusCode).render("./error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is lestening to port 8080");
});