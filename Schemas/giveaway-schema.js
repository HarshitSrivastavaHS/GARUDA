const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true
}

const giveawaySchema = mongoose.Schema({
  _id: reqString,
  prize: reqString,
  endTime: reqString,
  winners: reqString,
  chID: reqString,
  host: reqString
})

module.exports = mongoose.model("ongoing giveaways", giveawaySchema)
