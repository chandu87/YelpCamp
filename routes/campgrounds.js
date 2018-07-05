const express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground"),
  middlewareObj = require('../middleware');

//Campgrounds Route
router.get("/", function(req, res) {
  Campground.find({}, function(err, campgroundData) {
    if (err) {
      console.log("Error in getting data", err);
    } else {
      // console.log("Loaded data is : ",data);
      res.render("campgrounds/campgrounds", { data: campgroundData });
    }
  });
});

//Campgrounds POST to create new
router.post("/", middlewareObj.isLoggedIn, function(req, res) {
  const campName = req.body.name;
  const campUrl = req.body.image;
  const campDes = req.body.description;
  const authorDes = { id: req.user._id, username: req.user.username };
  const newCampground = {
    name: campName,
    image: campUrl,
    author: authorDes,
    description: campDes
  };

  //Saving new campgrond to DB
  Campground.create(newCampground, function(err, data) {
    if (err) {
      console.log("Error is :", err);
    } else {
      // console.log("New camp added to DB", data);
      res.redirect("/campgrounds/" + data._id);
    }
  });
});

//campgrounds new create page
router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

//Show campground with ID
router.get("/:id", function(req, res) {
  const reqId = req.params.id;
  Campground.findById(reqId)
    .populate("comments")
    .exec(function(err, data) {
      if (err) {
        console.log("Error in showing requestID page");
      } else {
        // console.log(data);
        res.render("campgrounds/show", { data: data });
      }
    });
});

//Edit Campgrounds Page
router.get("/:id/edit", middlewareObj.isUserAuthorizedToCampground, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
          res.render("campgrounds/edit", { campground: campground });
    });
});

//Update Campgrounds Page
router.put("/:id", middlewareObj.isUserAuthorizedToCampground, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
    err,
    campground
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});
//DELETE campgrounds
router.delete("/:id", middlewareObj.isUserAuthorizedToCampground, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});


module.exports = router;
