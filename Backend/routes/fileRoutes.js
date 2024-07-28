const express = require("express");
const uploadFileMulter = require("../config/uploadFileMulter");
const { createFile, deleteFileFolder} = require("../controller/fileController");


const fileRouter = express.Router();

fileRouter.route("/").post(uploadFileMulter.single("file"), createFile);
fileRouter.route("/delete/:type/:id").delete(deleteFileFolder);

module.exports = fileRouter;