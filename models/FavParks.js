const { Schema, model, Types } = require("mongoose");

const favPostSchema = new Schema({
  postId: {
    type: String,
  },
  creatorId: {
    type: Types.ObjectId,
    ref: "User",
  },
  backgroundImg: {
    type: String,
  },
  parkName: {
    type: String,
  },
});

const FavParks = model("FavParks", favPostSchema);
module.exports = FavParks;
