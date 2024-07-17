const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fieldname: { type: String, required: true },
  destination:{ type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  encoding: { type: String, required: true },
  size: { type: Number, required: true },
  createDate: { type: Date, default: Date.now }
});

const File = mongoose.model("File", fileSchema);
module.exports = File;
