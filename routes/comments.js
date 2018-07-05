//------ Comment ROUTES -----------
const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Campground = require("../models/campground"),
  Comment = require("../models/comment");

// Comments New
router.get("/new", isLoggeIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campgroundFound) {
    if (err) {
      console.log(err);
    } else {
      // console.log(campgroundFound);
      res.render("comments/new", { campground: campgroundFound });
    }
  });
});

//Comments create
router.post("/", isLoggeIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, function(err, newComment) {
        if (err) {
          console.log(err);
        } else {
          newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;
          newComment.save();
          campground.comments.push(newComment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
          //   console.log(newComment);
        }
      });
    }
  });
});
//Comments Edit ROUTE
router.get("/:comment_id/edit", isUserAuthorized, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, comment) {
      res.render("comments/edit", { campground_id: req.params.id, comment: comment });
  });
});

//Comments UPDATE ROUTE
router.put("/:comment_id",isUserAuthorized, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//comments DELETE ROUTE
router.delete("/:comment_id", isUserAuthorized, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
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
      Comment.findById(req.params.comment_id, function(err, comment) {
        if (err) {
          res.redirect("back");
        } else {
          if (comment.author.id.equals(req.user._id)) {
              next();
          } else {
            res.redirect("back");
          }
        }
      });
    } else {
      res.redirect("back");
    }
  
  }

module.exports = router;
