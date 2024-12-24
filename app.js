const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from the public directory
app.set("view engine", "ejs");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// Create a model
const Post = mongoose.model("Post", postSchema);

// Routes
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find(); // Use await for asynchronous call
    res.render("home", { posts: posts, startingContent: "Welcome to your Daily Journal!" });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Error fetching posts");
  }
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", async (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  try {
    await post.save(); // Use await for asynchronous call
    res.redirect("/");
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).send("Error saving post");
  }
});

app.get("/posts/:postId", async (req, res) => {
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findById(requestedPostId);
    res.render("post", { title: post.title, content: post.content });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send("Error fetching post");
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
  mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
  });
});
