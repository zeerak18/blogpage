//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true}, { useUnifiedTopology: true });

//create the mongoose blueprint schema
const postSchema = {
  title: String,
  content: String
};

//create mongoose model
const Post = mongoose.model('Post', postSchema);


//render uses the view engine and looks into the views folder and grabs home.ejs
app.get("/", (req, res) => {
// finds all the posts in the posts collection and renders that in the home.ejs file
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  })
});


// Get and post method for compose new article
app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", function(req, res){
// creates new post and saves it in the database with name title and content
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

//sometimes the post that is composed does not show up on the home page, so created a callback within the save method to check for errors otherwise redirect
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});

// the express routing method will display whatever input user puts in the url in the place of ":postName"
app.get("/posts/:postId", (req, res) => {
  const requestedPostId = req.params.postId;

//goes through the post collection to check for the requested ID and renders the data associated on the page.
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

//create the get request for the about page
  app.get("/about", function(req, res){
    res.render("about", {aboutContent: aboutContent});
  });

// create the get request for the contact page
  app.get("/contact", function(req, res){
    res.render("contact", {contactContent: contactContent});
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
