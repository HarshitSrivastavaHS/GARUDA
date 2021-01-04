const mongoose = require("mongoose");

module.exports = async () => {
  await mongoose.connect(process.env.MongoDB, {useNewUrlParser: true,useFindAndModify: false, useUnifiedTopology: true});
  return mongoose
}
