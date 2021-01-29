const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true
}

const welcomeSchema = mongoose.Schema({
  _id: reqString,
  chID: reqString
})

module.exports = mongoose.model("Welcome Channels", welcomeSchema)
