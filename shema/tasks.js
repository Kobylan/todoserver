const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "collum",
  },
  name: String,
  color: String,
  status: Boolean,
  desk: String,
});

module.exports = tasks = mongoose.model("tasks", taskSchema);
