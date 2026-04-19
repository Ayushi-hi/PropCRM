const mongoose = require('mongoose');

const activityEntrySchema = new mongoose.Schema({
  action: String,
  note: String,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
});

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  source: {
    type: String,
    enum: ['website', 'ads', 'referral', 'call', 'walk-in', 'other'],
    default: 'website',
  },
  budget: { type: Number },
  preferences: {
    propertyType: { type: String, enum: ['residential', 'commercial', 'any'], default: 'any' },
    location: { type: String },
    minSize: { type: Number },
    maxSize: { type: Number },
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Closed', 'Lost'],
    default: 'New',
  },
  score: { type: Number, default: 0, min: 0, max: 100 },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  nextAction: { type: String, default: 'Call Today' },
  lastContacted: { type: Date },
  interestedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  visitedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  interactionCount: { type: Number, default: 0 },
  timeline: [activityEntrySchema],
  notes: { type: String },
  isConverted: { type: Boolean, default: false },
  convertedAt: { type: Date },
}, { timestamps: true });

// Indexes
leadSchema.index({ status: 1, assignedAgent: 1 });
leadSchema.index({ score: -1 });
leadSchema.index({ email: 1 });
leadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);