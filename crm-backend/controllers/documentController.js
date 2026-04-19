const Document = require('../models/Document');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

// @desc  Upload / link a document (mock – store URL, no actual file server)
// @route POST /api/documents
const uploadDocument = async (req, res, next) => {
  try {
    const { name, fileUrl, fileType, fileSize, entityType, entityId, category, notes } = req.body;

    if (!name || !fileUrl || !entityType || !entityId) {
      return errorResponse(res, 'name, fileUrl, entityType, entityId are required', 400);
    }

    const doc = await Document.create({
      name, fileUrl, fileType, fileSize,
      entityType, entityId, category, notes,
      uploadedBy: req.user._id,
    });

    return successResponse(res, doc, 'Document saved', 201);
  } catch (error) {
    next(error);
  }
};

// @desc  Get documents for an entity
// @route GET /api/documents?entityType=deal&entityId=xxx
const getDocuments = async (req, res, next) => {
  try {
    const { entityType, entityId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (entityType) filter.entityType = entityType;
    if (entityId) filter.entityId = entityId;

    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      Document.find(filter)
        .populate('uploadedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Document.countDocuments(filter),
    ]);

    return paginatedResponse(res, docs, total, page, limit, 'Documents fetched');
  } catch (error) {
    next(error);
  }
};

// @desc  Delete document
// @route DELETE /api/documents/:id
const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return errorResponse(res, 'Document not found', 404);
    await doc.deleteOne();
    return successResponse(res, null, 'Document deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadDocument, getDocuments, deleteDocument };