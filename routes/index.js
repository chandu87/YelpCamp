// ----------------------
//INDEX Routes
// ----------------------
const express   = require("express"),
      router    = express.Router(),
      User      = require("../models/user"),
      passport  = require("passport");

//root ROUTE
router.get("/", function(req, res) {
  res.render("landing");
});

//Singup page GET 
router.get("/register", function(req, res) {
  res.render("register");
});

//Singup POST route
router.post("/register", function(req, res) {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function(err, user) {
      if (err) {
        console.log(err);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, function() {
        res.redirect("campgrounds");
      });
    }
  );
});
//Login page
router.get("/login", function(req, res) {
  res.render("login", {message : req.flash("error")});
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

//Logout Route
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/campgrounds");
});

//middleware for checking loggedin
function isLoggeIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
