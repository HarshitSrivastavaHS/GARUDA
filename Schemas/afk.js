const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true
}

const string = {
  type: String,
  required: false
}

const afk = mongoose.Schema({
  _id: reqString,
  afk: string,
  time: reqString,
})

module.exports = mongoose.model("AFK", afk)
