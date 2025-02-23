const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  latitude: Number,  // Store latitude from OpenStreetMap
  longitude: Number, // Store longitude from OpenStreetMap
  reviews: [
    {
    type: Schema.Types.ObjectId,
    ref: "Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: ["mountains","arctic","farms","deserts"]
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing){
  await Review.deleteMany({_id: {$in: listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;