//------ Comment ROUTES -----------
const express       = require('express'),
      router        = express.Router(),
      Campground    = require('../models/campground'),
      Comment       = require('../models/comment');

router.get("/campgrounds/:id/comments/new", isLoggeIn, function(req, res){
    Campground.findById(req.params.id, function(err, campgroundFound){
      if(err){
        console.log(err);
      }else{
        // console.log(campgroundFound);
        res.render('comments/new',{campground : campgroundFound});      
      }
    });
  });
  
  router.post("/campgrounds/:id/comments", isLoggeIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
      if(err){
        console.log(err);
      }else{
        Comment.create(req.body.comment, function(err, newComment){
          campground.comments.push(newComment);
          campground.save();
          res.redirect("/campgrounds/"+campground._id);
        });
      }
    })
  });

  //middleware for checking loggedin
function isLoggeIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }
  

  module.exports = router;
  