const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true
}

const prefixSchema = mongoose.Schema({
  _id: reqString,
  prefix: reqString,
})

module.exports = mongoose.model("prefix", prefixSchema)
