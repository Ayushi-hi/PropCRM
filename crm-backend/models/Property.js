const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  location: {
    address: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  price: { type: Number, required: true },
  type: {
    type: String,
    enum: ['residential', 'commercial'],
    required: true,
  },
  subType: {
    type: String,
    enum: ['apartment', 'villa', 'plot', 'office', 'shop', 'other'],
    default: 'apartment',
  },
  size: { type: Number }, // sq ft
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  amenities: [{ type: String }],
  images: [{ type: String }], // URLs
  status: {
    type: String,
    enum: ['available', 'sold', 'rented', 'under-negotiation'],
    default: 'available',
  },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  interestedLeads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lead' }],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

propertySchema.index({ 'location.city': 1, type: 1, status: 1 });
propertySchema.index({ price: 1 });

module.exports = mongoose.model('Property', propertySchema);