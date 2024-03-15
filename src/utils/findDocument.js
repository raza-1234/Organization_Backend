const { Document } = require("../sequelized/models");

const findDocument = async (documentId, organizationId) => {
  try {
    const document = await Document.findOne({
      where: {
        id: documentId,
        organizationId
      }
    });

    if (!document){
      return false;
    }
    return document; 
  } catch (err){
    throw new Error("Find Document: Something went wrong.", err);
  }
}

module.exports = {
  findDocument
}