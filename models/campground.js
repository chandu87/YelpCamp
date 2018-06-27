const mongoose = require("mongoose");

//Schema SETUP
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description : String
}); 
//Create Campground MODEL

module.exports = mongoose.model("Campground", campgroundSchema);
