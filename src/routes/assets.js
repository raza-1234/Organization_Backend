const Express = require("express");
const route = Express.Router();
const { uploadFile } =require("../middleware/uploadFile");

const { 
  addAssets, 
  getAssets, 
  deleteAsset
} = require("../controllers/assets");

route.post("/addAsset/:documentId", uploadFile, addAssets);
route.get("/getDocumentAssets/:documentId", getAssets);
route.delete("/deleteAsset/:assetId", deleteAsset);

module.exports = route;