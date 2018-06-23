const express = require("express");
const app = express();
const bodyPraser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

// let campData = [
//   {
//     name: "Tissvilde",
//     image:
//       "http://www.photosforclass.com/download/pixabay-1845719?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Fe83db50a2ff5083ed1584d05fb1d4e97e07ee3d21cac104497f9c27ca7efb1bd_960.jpg&user=Pexels"
//   },
//   {
//     name: "Mons-Klint",
//     image:
//       "http://www.photosforclass.com/download/pixabay-2768515?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Feb32b7072df5043ed1584d05fb1d4e97e07ee3d21cac104497f9c27ca7efb1bd_960.jpg&user=rawpixel"
//   },
//   {
//     name: "Klampenborg",
//     image: "http://www.photosforclass.com/download/flickr-14435096036"
//   }
// ];

//Schema SETUP
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description : String
}); 
//Create Campground MODEL

let Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//   name: "Tissvilde",
//   image:
//       "http://www.photosforclass.com/download/pixabay-1846142?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Fe83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104497f9c671a2e9b4b9_960.jpg&user=Pexels",
//       description: "This is a beautiful place. Good place for camping. Sand hills, long beach, beautiful view."
//   },function(err, data){
//     if(err){
//       console.log("Error In Creating File", err);
//     }
//     else{
//       console.log("Created File", data);
//     }
// });

app.use(bodyPraser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/campgrounds", function(req, res) {
  Campground.find({}, function(err, data){
    if(err){
      console.log("Error in getting data", err);
    }else{
      console.log("Loaded data is : ",data);
      res.render("campgrounds", { data: data });
    }
  });
  
});
app.post("/campgrounds", function(req, res) {
  const campName = req.body.name;
  const campUrl = req.body.image;
  const campDes = req.body.description;
  const newCampground = { name: campName, image: campUrl, description: campDes};
  // campData.push(newCampground);
  // res.render("campgrounds", { data: campData });
  Campground.create(newCampground, function(err, data){
    if(err){
      console.log("Error is :", err);
    }
    else{
      console.log("New camp added to DB", data);
      res.redirect("/campgrounds");
    }

  });
});
app.get("/campgrounds/new", function(req, res) {
  res.render("new");
});
app.get("/campgrounds/:id",function(req, res){
  const reqId = req.params.id;
  Campground.findById(reqId, function(err, data){
    if(err){
      console.log("Error in showing requestID page");
    }else{
      res.render("show", {data : data});
    }
  });
});

app.listen(3000, function() {
  console.log("Server started at : 3000");
});
