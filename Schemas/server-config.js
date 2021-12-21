const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true
}

const string = {
  type: String,
  required: false
}

const ServerConfig = mongoose.Schema({
  _id: reqString,
  prefix: string,
  suggestion: string,
  welcome: string,
  welcomer: {channel: string, message: string},
  leave: string,
  modLog: string,
  ghost: string,
  autoRole: string,
  goal: string,
  giveawayManagers: [string]
})

module.exports = mongoose.model("Server Config", ServerConfig)
