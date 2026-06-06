//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent = "Post your blog by going /compose url.";
const aboutContent = "My Name is Binoy";
const contactContent = "Contact me";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://gideon052:bKAJ_4VTxv-GjVf@ac-ors5rtl-shard-00-00.9zxd43y.mongodb.net:27017,ac-ors5rtl-shard-00-01.9zxd43y.mongodb.net:27017,ac-ors5rtl-shard-00-02.9zxd43y.mongodb.net:27017/blogDB?ssl=true&replicaSet=atlas-kebogh-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true }
);

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", async function (req, res) {
  try {
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody,
    });

    await post.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started on port 3000");
});
