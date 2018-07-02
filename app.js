const express       = require("express"),
      app           = express(),
      bodyPraser    = require("body-parser"),
      mongoose      = require("mongoose"),
      Campground    = require("./models/campground"),
      Comment       = require("./models/comment"),
      passport      = require('passport'),
      localStrategy = require('passport-local'),
      User          = require('./models/user');

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

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  Campground.find({}, function(err, data){
    if(err){
      console.log("Error in getting data", err);
    }else{
      console.log("Loaded data is : ",data);
      res.render("campgrounds/campgrounds", { data: data });
    }
  });
  
});
app.post("/campgrounds", function(req, res) {
  const campName = req.body.name;
  const campUrl = req.body.image;
  const campDes = req.body.description;
  const newCampground = { name: campName, image: campUrl, description: campDes};
  // campData.push(newCampground);
  // res.render("campgrounds", { data: campData });
  Campground.create(newCampground, function(err, data){
    if(err){
      console.log("Error is :", err);
    }
    else{
      console.log("New camp added to DB", data);
      res.redirect("campgrounds/campgrounds");
    }

  });
});
app.get("/campgrounds/new", function(req, res) {
  res.render("campgrounds/new");
});
app.get("/campgrounds/:id",function(req, res){
  const reqId = req.params.id;
  Campground.findById(reqId).populate("comments").exec(function(err, data){
    if(err){
      console.log("Error in showing requestID page");
    }else{
      console.log(data);
      res.render("campgrounds/show", {data : data});
    }
  });
});

app.get("/campgrounds/:id/comments/new", function(req, res){
  Campground.findById(req.params.id, function(err, campgroundFound){
    if(err){
      console.log(err);
    }else{
      console.log(campgroundFound);
      res.render('comments/new',{campground : campgroundFound});      
    }
  });
});

app.post("/campgrounds/:id/comments", function(req, res){
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

//Singup page
app.get("/register", function(req, res){
  res.render("register");
})
app.post("/register", function(req, res){
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("campgrounds");
    });

  });  
})

app.listen(3000, function() {
  console.log("Server started at : 3000");
});
