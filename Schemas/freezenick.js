const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true
}

const string = {
  type: String,
  required: false
}

const freeze = mongoose.Schema({
  _id: reqString,
  nick: string
})

module.exports = mongoose.model("FREEZED NICKS", freeze)
