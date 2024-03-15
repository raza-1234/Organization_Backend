const { Asset } = require("../sequelized/models");
const { findDocument } = require("../utils/findDocument");
const { paginationInfo } = require("../utils/pagination");
const { Op } = require("sequelize")

const addAssets = async (req, res) => {
  const {
    user: {
      organizationId
    },
    body: {
      type,
      title,
      date
    }, 
    params: {
      documentId
    }, 
    file: {
      path
    }
  } = req;

  const assetsType = ["image", "audio", "video"];
  const formatAssetType = type.toLowerCase(); 

  if (!(type && title && date && path)){
    return res.status(400).json(
      {"message": "All fields are required."}
    )
  }

  if (!assetsType.includes(formatAssetType)){
    return res.status(400).json(
      {"message": "Invalid file type."}
    )
  }

  try {
    const documentExist = await findDocument(documentId, organizationId);
    
    if (!documentExist){
      return res.status(404).json(
        {"message": "Document not found."}
      )
    }

    const newAsset = {
      title: title.toLowerCase(),
      type: formatAssetType,
      date,
      documentId, 
      organizationId: documentExist.organizationId,
      url: path
    }

    await Asset.create(newAsset);
    return res.status(200).json(
      {"message": "asset added successfully."}
    );
  } catch (err){
    console.log("AddAsset: Internal server error.", err);
    return res.status(500).json(
      {"message": "Internal server error."}
    );
  }
}

const getAssets = async (req, res) => {
  const {
    user: {
      organizationId
    }, 
    params: {
      documentId
    },
    query: {
      title
    }
  } = req;

  const start = Number(req.query?.start) || 0;
  const count = Number(req.query?.count) || 5;

  const queryCondition = {
    order: [ 
      ['id', 'DESC']
    ],
    where: {
      documentId,
      organizationId
    },
    include: { all: true },
    limit: count,
    offset: start
  }

  if (title){
    queryCondition.where = {
      [Op.and]: [
        {
          documentId,
          organizationId,
          title: {
            [Op.like]: `%${title}%`
          }
        }
      ]
    }
  }

  try {
    const documentExist = await findDocument(documentId, organizationId);
    if (!documentExist){
      return res.status(404).json(
        {"message": "Document not found."}
      )
    }

    const { count: assetsTotalCount, rows: assetsPayload } = await Asset.findAndCountAll(queryCondition);

    if (assetsPayload.length === 0){
      return res.status(200).json({
        status: {"message": "Document is empty.", statusCode: 404},
        documentAssets: [],
        paginationInfo: {}
      })
    }

    const { data, paging } = paginationInfo(assetsPayload, start, count, assetsTotalCount);
    return res.status(200).json({
      status: {"message": "Assets found successfully.", statusCode: 200},
        documentAssets: data,
        pagingInfo: paging
      }
    );

  } catch (err){
    console.log("GetAssets: Internal server error.", err);
    return res.status(500).json(
      {"message": "Internal server error."}
    )
  }
}

const deleteAsset = async (req, res) => {
  const {
    params: {
      assetId
    }
  } = req;

  const {
    user: {
      organizationId,
      role
    }
  } = req;

  try {
    const assetExist = await Asset.findOne({
      where: {
        id: assetId,
        organizationId
      }
    });

    if (!assetExist){
      return res.status(404).json(
        {"message": "asset not found."}
      );
    }

    if (role === "user"){
      return res.status(403).json(
        {"message": "Request denied!. You can not delete the asset."}
      )
    }

    await assetExist.destroy();
    return res.status(200).json(
      {"messgae": "Asset deleted successfully."}
    );

  } catch (err){
    console.log("Delete Asset: Internal server error.", err);
    return res.status(500).json(
      {"message": "Internal server error."}
    )
  }
}

module.exports = { addAssets, getAssets, deleteAsset }