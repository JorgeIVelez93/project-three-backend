var express = require("express");
const { isAuthenticated } = require("../middleware/auth");
var router = express.Router();
const Post = require("../models/Posts");

router.get("/all", async (req, res) => {
  try {
    const allPosts = await Post.find().populate("creatorId");
    res.json(allPosts);
  } catch (err) {
    res.json(err.message);
  }
});
router.get("/user-pen", isAuthenticated, async (req, res) => {
  try {
    const allPosts = await Post.find({
      creatorId: req.user.id,
    })
      .populate("creatorId")
      .sort({ createdAt: -1 });
    res.json(allPosts);
  } catch (err) {
    res.json(err.message);
  }
});

router.post("/create", isAuthenticated, async (req, res) => {
  try {
    let newPost = await Post.create({
      content: req.body.content,
      creatorId: req.user.id,
    });
    res.json(newPost);
  } catch (err) {
    res.json(err.message);
  }
});

router.post("/likes/:postId", isAuthenticated, async (req, res) => {
  try {
    let updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $addToSet: { likes: req.user.id } },
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;
