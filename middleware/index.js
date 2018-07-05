const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middlewareObj = {};
//middleware for checking loggedin
middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to Login First to do that!!");
  res.redirect("/login");
};
middlewareObj.isUserAuthorizedToComment = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err) {
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to edit this comment");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be Login First!!");
    res.redirect("/login");
  }
};

middlewareObj.isUserAuthorizedToCampground = function (req, res, next){
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, function(err, campground) {
        if (err) {
          req.flash("error", "Campground not found!!");
          res.redirect("/campgrounds");
        } else {
          if (campground.author.id.equals(req.user._id)) {
              next();
          } else {
            req.flash("error", "You don't have permission to do that!!")
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "You need to Login First!!");
      res.redirect("/login");
    }
  
  }
  
module.exports = middlewareObj;
