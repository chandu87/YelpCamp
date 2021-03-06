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
        // console.log(err);
        req.flash("error", err.message);
        return res.redirect("/register");
      }
      passport.authenticate("local")(req, res, function() {
        req.flash("success", "Welcome to CPH-Camp "+ user.username);
        res.redirect("/campgrounds");
      });
    }
  );
});
//Login page
router.get("/login", function(req, res) {
  res.render("login");
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
  req.flash("success", "Logged Out Successfully");
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
