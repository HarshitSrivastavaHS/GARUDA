const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true
}

const suggestionSchema = mongoose.Schema({
  _id: reqString,
  channel_Id: reqString,
})

module.exports = mongoose.model("Suggestion channel", suggestionSchema)
