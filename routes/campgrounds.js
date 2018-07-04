const   express     = require("express"),
        router      = express.Router(),
        Campground  = require("../models/campground");

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
router.post("/", function(req, res) {
  const campName = req.body.name;
  const campUrl = req.body.image;
  const campDes = req.body.description;
  const newCampground = {
    name: campName,
    image: campUrl,
    description: campDes
  };
  // campData.push(newCampground);
  // res.render("campgrounds", { data: campData });
  Campground.create(newCampground, function(err, data) {
    if (err) {
      console.log("Error is :", err);
    } else {
      // console.log("New camp added to DB", data);
      res.redirect("campgrounds/campgrounds");
    }
  });
});
router.get("/new", function(req, res) {
  res.render("campgrounds/new");
});
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

module.exports = router;