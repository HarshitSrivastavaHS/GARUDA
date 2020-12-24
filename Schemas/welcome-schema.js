const mongoose = require("mongoose");

const reqString = {
  type: String,
  require: true
}

const welcomeSchema = mongoose.Schema({
  _id: reqString,
  channelId: reqString,
  message: reqString
})

module.export = mongoose.model("welcome-channels", welcomeSchema)
