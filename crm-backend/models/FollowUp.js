const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  note: { type: String },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled', 'Snoozed'],
    default: 'Pending',
  },
  actionType: {
    type: String,
    enum: ['Call', 'Email', 'Site Visit', 'Meeting', 'Send Info'],
    default: 'Call',
  },
  completedAt: { type: Date },
  outcome: { type: String },
}, { timestamps: true });

followUpSchema.index({ scheduledAt: 1, status: 1 });
followUpSchema.index({ assignedAgent: 1, status: 1 });

module.exports = mongoose.model('FollowUp', followUpSchema);