const { response } = require("express");
const Listing = require("../models/listing");
const axios = require("axios");

//for index
module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}

//for new 
module.exports.renderNewForm = (req,res) => { //check for user is isAuthenticated 
    res.render("./listings/new.ejs")
}

//for show 
module.exports.show = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews", populate: {path: "author"}})
    .populate("owner");    //for owner
    if(!listing){
        req.flash("error", "Listing deleted");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {listing});
}

//for create
module.exports.createListing = async (req,res,next) => {
    //let {title, description, image, price, country, location} = req.body; new tarika niche hai
    // try{

        let url = req.file.path;
        let filename = req.file.filename;
         //User se input location lo (e.g., Jaipur, Mumbai)
         const { location } = req.body.listing;

         // OpenStreetMap Nominatim API Se Latitude & Longitude Fetch Karo
        const geoData = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);

        let latitude = 0;
        let longitude = 0;

        if (geoData.data.length > 0) {
            latitude = geoData.data[0].lat;
            longitude = geoData.data[0].lon;
        }
        const newListing = new Listing (req.body.listing);
        newListing.owner = req.user._id;  //for new listing owner
        newListing.image = {url, filename};
        newListing.latitude = latitude;
        newListing.longitude = longitude;

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    // }
    // catch(err) {
    //     next(err);
    // }
};

//for edit
module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing deleted");
        res.redirect("/listings");
    }
    let originalImageURl = listing.image.url;
    originalImageURl = originalImageURl.replace("/upload","/upload/w_250")
    res.render("./listings/edit.ejs",{listing, originalImageURl});
};

//for update
module.exports.update = async (req,res) => {
    let {id} = req.params;   
    const userLocation = req.body.listing.location;

    //OpenStreetMap (Nominatim) se naya latitude & longitude fetch karo
    const geoData = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
            q: userLocation,
            format: "json",
            limit: 1
        }
    });

    if (geoData.data.length === 0) {
        req.flash("error", "Location not found!");
        return res.redirect(`/listings/${id}/edit`);
    } 
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//for destroye
module.exports.delete = async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

