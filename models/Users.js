const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  profilePic: {
    type: String,
  },
  favParks: [{ type: Types.ObjectId, ref: "FavParks" }],
});

const User = model("User", userSchema);
module.exports = User;
