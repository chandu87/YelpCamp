const mongoose = require("mongoose");

//Schema SETUP
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description : String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
}); 
//Create Campground MODEL

module.exports = mongoose.model("Campground", campgroundSchema);
