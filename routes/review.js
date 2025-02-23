const express = require("express");
const router = express.Router({mergeParams: true});  //that is merge parameter like id
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIn, isreviewAuthor} = require("../middleware.js")
const reviewsController = require("../controllers/reviews.js");

//Reviews
//Post review Route 
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewsController.postReview));


//delete review route
router.delete("/:reviewId",isLoggedIn, isreviewAuthor, wrapAsync(reviewsController.destroyeReview));

module.exports = router;