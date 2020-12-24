const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true
}

const welcomeSchema = mongoose.Schema({
  _id: reqString,
  channelId: reqString,
  message: reqString
});
