var express = require("express");
var router = express.Router();
const User = require("../models/Users");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const FavParks = require("../models/FavParks");

const { isAuthenticated } = require("../middleware/auth");
const fileUploader = require("../middleware/cloudinary");

const { response } = require("../app");

const saltrounds = 10;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.json({ message: "Please include a username and password." });
  }

  try {
    const salt = bcryptjs.genSaltSync(saltrounds);
    const hashedpass = bcryptjs.hashSync(req.body.password, salt);
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: hashedpass,
      email: req.body.email,
      age: req.body.age,
      profilePic: req.body.profilePic,
      favParks: req.body.favParks,
    });
    const payload = {
      username: newUser.username,
      id: newUser._id,
    };
    const token = jwt.sign(payload, process.env.SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });
    res.json(token);
  } catch (err) {
    res.json(err.message);
  }
});

router.post("/login", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.json({ message: "Please include a username and password." });
  }
  try {
    let foundUser = await User.findOne({ username: req.body.username });
    if (!foundUser) {
      return res
        .status(400)
        .json({ message: "Please include a username and password " });
    }
    const isMatch = bcryptjs.compareSync(req.body.password, foundUser.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect." });
    }
    const payload = {
      username: foundUser.username,
      id: foundUser._id,
    };
    const token = jwt.sign(payload, process.env.SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });
    res.json({
      token: token,
      username: foundUser.username,
      profilePic: foundUser.profilePic,
    });
  } catch (err) {
    res.status(400).js;
    // 7yhbg on(err.message);
  }
});
router.get("/login-test", isAuthenticated, (req, res) => {
  res.json({ messsage: "You are logged in" });
});

router.post(
  "/add-picture",
  fileUploader.single("imageUrl"),
  async (req, res) => {
    res.json(req.file);
  }
);

router.post("/fav-park", isAuthenticated, async (req, res) => {
  const favoriteParkList = await FavParks.create({
    postId: req.body.postId,
    backgroundImg: req.body.backgroundImg,
    parkName: req.body.parkName,
    creatorId: req.user.id,
  });
  res.json(favoriteParkList);
});
router.get("/all-parks", isAuthenticated, async (req, res) => {
  try {
    const favoriteParks = await FavParks.find({
      creatorId: req.user.id,
    }).populate("creatorId");
    res.json(favoriteParks);
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;
