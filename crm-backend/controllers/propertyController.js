const Property = require('../models/Property');
const Activity = require('../models/Activity');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

// @desc  Create property
// @route POST /api/properties
const createProperty = async (req, res, next) => {
  try {
    const property = await Property.create({ ...req.body, postedBy: req.user._id });

    await Activity.create({
      entityType: 'property',
      entityId: property._id,
      action: 'PROPERTY_CREATED',
      description: `Property "${property.title}" added`,
      performedBy: req.user._id,
    });

    return successResponse(res, property, 'Property created', 201);
  } catch (error) {
    next(error);
  }
};

// @desc  Get all properties
// @route GET /api/properties
const getProperties = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 20, type, status, city,
      minPrice, maxPrice, search,
    } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate('assignedAgent', 'name email')
        .populate('postedBy', 'name')
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Property.countDocuments(filter),
    ]);

    return paginatedResponse(res, properties, total, page, limit, 'Properties fetched');
  } catch (error) {
    next(error);
  }
};

// @desc  Get single property
// @route GET /api/properties/:id
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('assignedAgent', 'name email phone')
      .populate('interestedLeads', 'name phone status score');
    if (!property) return errorResponse(res, 'Property not found', 404);
    return successResponse(res, property, 'Property fetched');
  } catch (error) {
    next(error);
  }
};

// @desc  Update property
// @route PUT /api/properties/:id
const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!property) return errorResponse(res, 'Property not found', 404);
    return successResponse(res, property, 'Property updated');
  } catch (error) {
    next(error);
  }
};

// @desc  Delete property
// @route DELETE /api/properties/:id
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return errorResponse(res, 'Property not found', 404);
    await property.deleteOne();
    return successResponse(res, null, 'Property deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty };