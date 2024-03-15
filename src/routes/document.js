const Express = require("express");
const route = Express.Router();

const {
  createDocument, 
  getDocuments,
  updateDocument,
  deleteDocument
} = require("../controllers/document");

route.post("/createDocument", createDocument);
route.get("/getDocument", getDocuments);
route.delete("/deleteDocument/:documentId", deleteDocument);
route.put("/updateDocument/:documentId", updateDocument);

module.exports = route; 