const express = require('express');
const app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("home");
});

app.get("/campgrounds", function(req, res){
    const campData = [
                    {name : "Tissvilde", image : ""},
                    {name : "Mons-Klint", image : ""},
                    {name : "Klampenborg", image : ""}];
    res.render("campgrounds", {data : campData});
});

app.listen(3000, function(){
    console.log("Server started at : 3000");
});