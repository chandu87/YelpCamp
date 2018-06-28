const express = require("express");
const app = express();
const bodyPraser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground")
mongoose.connect("mongodb://localhost/yelp_camp");
const seedDb = require("./seeds");
seedDb();


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
  Campground.findById(reqId).populate("comments").exec(function(err, data){
    if(err){
      console.log("Error in showing requestID page");
    }else{
      console.log(data);
      res.render("show", {data : data});
    }
  });
});

app.listen(3000, function() {
  console.log("Server started at : 3000");
});
