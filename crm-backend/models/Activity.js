const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  entityType: {
    type: String,
    enum: ['lead', 'client', 'deal', 'property', 'followup'],
    required: true,
  },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  action: { type: String, required: true },
  description: { type: String },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

activitySchema.index({ entityType: 1, entityId: 1 });
activitySchema.index({ performedBy: 1 });
activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);