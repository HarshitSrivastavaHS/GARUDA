const mongoose = require("mongoose");

const blockedSchema = mongoose.Schema({
  _id: {
  type: String,
  required: true
},
  blocks: {
  type: Array
},
})

module.exports = mongoose.model("blockedDm", blockedSchema)
