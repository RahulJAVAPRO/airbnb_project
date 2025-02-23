const Listing = require("./models/listing")
const {listingSchema, reviewSchema} = require("./schema.js");//for schema to required joi
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js")

// for user logged or not

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        //orignal url to redirect after user logged in
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must logged in to create listing!");
        return res.redirect("/login")
    }
    next();
};

// after login to go ogrinal URL
module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// for owner of id to edit or delete post

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// that is for joi validation for server side and api
module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//for review middleware
module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//this is for review deleteing means jiski id vahi sirf review ko delete kere

module.exports.isreviewAuthor = async (req,res,next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}