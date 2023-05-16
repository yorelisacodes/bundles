const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
    location: {
    type: String,
  },
  price: {
    type: String,
    required: true,
  },
  seller: {
    type: String,
    ref: "User",
  },
  savedBy: {
    type: null | String,
  },
   saved: {
    type: Boolean,
  },
  purchasedBy: {
    type: null | String,
  },
   purchased: {
    type: Boolean,
  },
  date: {
    type: String,
  }
});

module.exports = mongoose.model("Post", PostSchema);
