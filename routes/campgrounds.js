const express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground");

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
router.post("/", isLoggeIn, function(req, res) {
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
router.get("/new", isLoggeIn, function(req, res) {
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
router.get("/:id/edit", isUserAuthorized, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
          res.render("campgrounds/edit", { campground: campground });
    });
});

//Update Campgrounds Page
router.put("/:id", isUserAuthorized, function(req, res) {
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
router.delete("/:id", isUserAuthorized, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//middleware for checking loggedin
function isLoggeIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function isUserAuthorized(req, res, next){
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, campground) {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        if (campground.author.id.equals(req.user._id)) {
            next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("/login");
  }

}

module.exports = router;
