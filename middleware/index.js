const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middlewareObj = {};
//middleware for checking loggedin
middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};
middlewareObj.isUserAuthorizedToComment = function(req, res, next) {
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
};

middlewareObj.isUserAuthorizedToCampground = function (req, res, next){
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
  
module.exports = middlewareObj;
