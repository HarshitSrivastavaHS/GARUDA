const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true
}

const opString = {
  type: String,
  required: false,
  default: undefined
}


const giveawaySchema = mongoose.Schema({
  _id: reqString,
  prize: reqString,
  endTime: reqString,
  winners: reqString,
  chID: reqString,
  host: reqString,
  reqs: opString,
  guild: reqString,
})

module.exports = mongoose.model("ongoing giveaways", giveawaySchema)
