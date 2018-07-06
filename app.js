const express       = require("express"),
      app           = express(),
      bodyPraser    = require("body-parser"),
      mongoose      = require("mongoose"),
      flash         = require('connect-flash')
      Campground    = require("./models/campground"),
      Comment       = require("./models/comment"),
      passport      = require('passport'),
      localStrategy = require('passport-local'),
      User          = require('./models/user'),
      methodOverride= require('method-override'),
      port     = process.env.PORT || 3000;

//Requiring routes
const campgroundRoutes  = require('./routes/campgrounds'),
      commentRoutes      = require('./routes/comments'),
      indexRoutes       = require('./routes/index');

// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://chandu:chandu0988@ds125183.mlab.com:25183/cphcamp");
//mongodb://chandu:chandu0988@ds125183.mlab.com:25183/cphcamp

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require('express-session')({
  secret: "Yelp camps are the best",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const seedDb = require("./seeds");
//Seeding database but now we are going to do manually
//seedDb();

app.use(bodyPraser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(function(req, res, next){
  res.locals.user = req.user;
  res.locals.successMessage = req.flash("success");
  res.locals.errorMessage = req.flash("error");  
  next();
});
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(port, function() {
  console.log("Server started at : 3000");
});
