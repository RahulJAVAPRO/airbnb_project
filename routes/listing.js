const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


//index route
router
    .route("/")
    .get(wrapAsync(listingController.index))  
    //create route
     .post(isLoggedIn,           
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)
 );


//new data
router.get("/new", isLoggedIn, listingController.renderNewForm);


//show route
router
    .route("/:id")
    .get(wrapAsync(listingController.show))
    //update route
    .put(isLoggedIn, 
        isOwner, 
        upload.single("listing[image]"),
        validateListing, 
        wrapAsync(listingController.update))
    //delete route
    .delete(isLoggedIn, 
        isOwner, 
        wrapAsync(listingController.delete)
);

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;

