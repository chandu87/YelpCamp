//------ Comment ROUTES -----------
const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Campground = require("../models/campground"),
  Comment = require("../models/comment"),
  middlewareObj = require('../middleware');

// Comments New
router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
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
router.post("/", middlewareObj.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, function(err, newComment) {
        if (err) {
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          //Add username and Id to comment
          newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;
          // Saving comment
          newComment.save();
          campground.comments.push(newComment);
          campground.save();
          req.flash("success", "Successfully created Comment");
          res.redirect("/campgrounds/" + campground._id);
          //   console.log(newComment);
        }
      });
    }
  });
});
//Comments Edit ROUTE
router.get("/:comment_id/edit", middlewareObj.isUserAuthorizedToComment, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, comment) {
      res.render("comments/edit", { campground_id: req.params.id, comment: comment });
  });
});

//Comments UPDATE ROUTE
router.put("/:comment_id",middlewareObj.isUserAuthorizedToComment, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
          req.flash("success", "Comment Successfully Updated");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//comments DELETE ROUTE
router.delete("/:comment_id", middlewareObj.isUserAuthorizedToComment, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
          req.flash("success", "Comment Successfully Deleted");
            res.redirect("/campgrounds/"+req.params.id);
            }
    });
});


module.exports = router;
