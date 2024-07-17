const express = require("express");
const { upload } = require("../middlewares/upload");
const File = require("../models/file");


const uploadRouter = express.Router();

uploadRouter.post("/",upload,async (req, res) =>{
    if (req.file == undefined) {
        throw new Error("No File Selected")
      }else {
        const file = new File(req.file)
        const path = '/app/' + file.path
        // app/uploads/...
        file.path =  path 
        const result = await file.save()
        return res.json(result)
      }

})


module.exports = uploadRouter