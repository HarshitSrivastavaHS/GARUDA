const mongoose = require("mongoose");

module.exports = async () => {
  await mongoose.connect(process.env.MongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
  return mongoose
}
