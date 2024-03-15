const { Document, Organization, Asset } = require("../sequelized/models");
const { findDocument } = require("../utils/findDocument");

const createDocument = async (req, res) => {
  const {
    user: {
      organizationId
    },
    body: {
      documentName
    }
  } = req;

  if (!documentName){
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

    await Document.create({
      organizationId,
      documentName
    });

    return res.status(200).json(
      {"message": "Document created successfully."}
    );

  } catch (err){
    console.log("Document: Internal server error.", err);
    return res.status(500).json(
      {"message": "Internal server error."}
    )
  }
}

const getDocuments = async (req, res) => {
  const {
    user: {
      organizationId
    }
  } = req;

  try {
    const documents = await Document.findAll({
      where: {
        organizationId
      },
      order: [
        ['id', 'ASC']
      ],
      include: [
        {
          model: Organization,
        } 
      ]
    });

    if (documents.length === 0){
      return res.status(200).json({
        status: {'message': "no document exist.", statusCode: 404},
        documentData: [],
      });
    }

    return res.status(200).json({
      status: {'message': "Document found successfully", statusCode: 200}, 
      documentData: documents
    });
  } catch (err){
    console.log("GetAllDocuments: Internal server error.", err);
    return res.status.json(
      {"message": 'Internal server error.'}
    );
  }
}

const updateDocument = async (req, res) => {
  const { 
    user: {
      organizationId
    }, 
    body: { documentName },
    params: { documentId },
  } = req;

  if (!documentName){
    return res.status(400).json(
      {"message": "All fields are required."}
    )
  }

  try {
    const documentExist = await findDocument(documentId, organizationId);

    if (!documentExist){
      return res.status(404).json(
        {"message": "Document not found."}
      );
    }
    documentExist.documentName = documentName;
    const updatedDocument = await documentExist.save();

    return res.status(200).json(
      {
        "message": "changes saved",
        updatedDocument
      }
    );
  } catch (err){
    console.log("updateDocument: Internal server error.", err);
    return res.status(500).json(
      {"message": "Internal server error."}
    )
  }
}
 
const deleteDocument = async (req, res) => {
  const { 
    user: {
      organizationId
    },
    params: {
      documentId
    }
  } = req;

  try {
    const documentExist = await findDocument(documentId, organizationId);

    if (!documentExist) {
      return res.status(404).json(
        {"message": "Document not found."}
      )
    }

    const documentAssets = await Asset.findAll({
      where: {
        documentId,
        organizationId
      }
    })

    if (documentAssets.length > 0){
      return res.status(400).json(
        {"message": "Cannot delete document. It has associated assets."}
      )
    }
    
    await documentExist.destroy();
    return res.status(200).json(
      {"message": "Document deleted successfully."}
    );

  } catch (err){
    console.log("Delete Document: Internal server error.", err);
    return res.status(500).json(
      {"message": "Internal server error."}
    )
  }
}

module.exports = {
  createDocument, 
  getDocuments,
  updateDocument,
  deleteDocument
}