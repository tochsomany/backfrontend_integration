const express = require("express");
const File = require("../models/file");

const fileRouter = express.Router();

fileRouter.get("/:id",async (req, res) => {
  const id = req.params.id;
  const file = await File.findById(id);
  console.log(file)
  return res.sendFile(file.path)
});

module.exports = fileRouter;
