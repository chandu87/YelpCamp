const express = require('express');
const app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("home");
});

app.get("/campgrounds", function(req, res){
    const campData = [
                    {name : "Tissvilde", image : "http://www.photosforclass.com/download/pixabay-1845719?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Fe83db50a2ff5083ed1584d05fb1d4e97e07ee3d21cac104497f9c27ca7efb1bd_960.jpg&user=Pexels"},
                    {name : "Mons-Klint", image : "http://www.photosforclass.com/download/pixabay-2768515?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2Feb32b7072df5043ed1584d05fb1d4e97e07ee3d21cac104497f9c27ca7efb1bd_960.jpg&user=rawpixel"},
                    {name : "Klampenborg", image : "http://www.photosforclass.com/download/flickr-14435096036"}];
    res.render("campgrounds", {data : campData});
});

app.listen(3000, function(){
    console.log("Server started at : 3000");
});