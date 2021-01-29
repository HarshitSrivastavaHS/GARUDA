const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true
}

const leavesSchema = mongoose.Schema({
  _id: reqString,
  chID: reqString
})

module.exports = mongoose.model("Leaves Channels", leavesSchema)
