const User = require('../models/User');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

// @desc  Get all users
// @route GET /api/users
// @access Admin, Manager
const getUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter).select('-password').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    return paginatedResponse(res, users, total, page, limit, 'Users fetched');
  } catch (error) {
    next(error);
  }
};

// @desc  Get single user
// @route GET /api/users/:id
// @access Admin, Manager
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, user, 'User fetched');
  } catch (error) {
    next(error);
  }
};

// @desc  Update user
// @route PUT /api/users/:id
// @access Admin
const updateUser = async (req, res, next) => {
  try {
    const { name, phone, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, role, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, user, 'User updated');
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, updateUser };