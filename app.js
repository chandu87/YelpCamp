const express       = require("express"),
      app           = express(),
      bodyPraser    = require("body-parser"),
      mongoose      = require("mongoose"),
      Campground    = require("./models/campground"),
      Comment       = require("./models/comment"),
      passport      = require('passport'),
      localStrategy = require('passport-local'),
      User          = require('./models/user');
const campgroundRoutes  = require('./routes/campgrounds'),
      commentRoutes      = require('./routes/comments'),
      indexRoutes       = require('./routes/index');

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(express.static(__dirname + "/public"));

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
seedDb();

app.use(bodyPraser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(function(req, res, next){
  res.locals.user = req.user;
  next();
});
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function() {
  console.log("Server started at : 3000");
});
