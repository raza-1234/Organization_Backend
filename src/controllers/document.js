const { Document, Organization } = require("../sequelized/models");

const findDocument = async (documentId) => {
  try {
    const document = await Document.findOne({
      where: {
        id: documentId
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

const createDocument = async (req, res) => {
  const organizationId = Number(req.params.organizationId);
  const { documentName } = req.body;

  if (!organizationId){
    return res.status(400).json(
      {"message": "Required param not found."}
    )
  }

  if (!documentName?.trim()){
    return res.status(400).json(
      {"message": "All fields are required."}
    )
  }

  try {
    const organizationExist = await Organization.findOne({
      where: {
        id: organizationId
      }
    });

    if (!organizationExist){
      return res.status(404).json(
        {"message": "Organization not exist."}
      )
    }

    const newDocument = {
      organizationId,
      documentName
    }

    const addDocument = await Document.create(newDocument);
    return res.status(200).json(
    {
      "message": "Document created successfully.",
      addDocument
    });

  } catch (err){
    console.log("Document: Internal server error.", err);
    return res.status(500).json(
      {"message": err}
    )
  }
}

const getDocuments = async (req, res) => {
  const organizationId = Number(req.params.organizationId);

  if (!organizationId){
    return res.status(200).json(
      {"message": "Required param not found."}
    )
  }

  try {
    const documents = await Document.findAll({
      where: {
        organizationId
      },
      onder: [
        ['id', 'ASC']
      ],
      include: [
        {
          model: Organization,
        } 
      ]
    });

    if (documents.length === 0){
      return res.status(200).json(
        {"message": "no document exist.", documentData: []}
      )
    }
    return res.status(200).json(documents);
  } catch (err){
    console.log("GetAllDocuments: Internal server error.", err);
    return res.status.json({"message": err});
  }
}

const updateDocument = async (req, res) => {
  const { documentName } = req.body;
  const documentId  = Number(req.params.documentId);

  if (!documentId){
    return res.status(400).json(
      {"message": "Required param not found."}
    )
  }

  if (!documentName?.trim()){
    return res.status(400).json(
      {"message": "All fields are required."}
    )
  }

  try {
    const documentExist = await findDocument(documentId);

    if (!documentExist){
      return res.status(404).json(
        {"message": "Document not found."}
      );
    }
    documentExist.documentName = documentName;
    await documentExist.save();

    return res.status(200).json({
      "message": "changes saved",
      documentExist
    });
  } catch (err){
    console.log("updateDocument: Internal server error.", err);
    return res.status(500).json(
      {"message": err}
    )
  }
}
 
const deleteDocument = async (req, res) => {
  const documentId  = Number(req.params.documentId);

  if (!documentId){
    return res.status(400).json(
      {"message": "Required param not found."}
    )
  }

  try {
    const documentExist = await findDocument(documentId);

    if (!documentExist) {
      return res.status(404).json(
        {"message": "Document not found."}
      )
    }
    await documentExist.destroy();
    return res.status(200).json(
      {"message": "Document deleted successfully."}
    );

  } catch (err){
    console.log("Delete Document: Internal server error.", err);
    return res.status(500).json(
      {"message": err}
    )
  }
}

module.exports = {
  createDocument, 
  getDocuments,
  updateDocument,
  deleteDocument
}