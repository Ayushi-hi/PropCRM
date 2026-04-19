const mongoose = require('mongoose');

const stageHistorySchema = new mongoose.Schema({
  stage: String,
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  changedAt: { type: Date, default: Date.now },
  note: String,
});

const dealSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stage: {
    type: String,
    enum: ['Qualification', 'Proposal', 'Site Visit', 'Negotiation', 'Agreement', 'Closed', 'Lost'],
    default: 'Qualification',
  },
  dealValue: { type: Number, required: true },
  commissionRate: { type: Number, default: 2 }, // percentage
  commission: { type: Number }, // auto-calculated
  status: {
    type: String,
    enum: ['active', 'closed', 'lost'],
    default: 'active',
  },
  expectedCloseDate: { type: Date },
  closedAt: { type: Date },
  notes: { type: String },
  stageHistory: [stageHistorySchema],
}, { timestamps: true });

// Auto-calculate commission before save
dealSchema.pre('save', function (next) {
  if (this.dealValue && this.commissionRate) {
    this.commission = (this.dealValue * this.commissionRate) / 100;
  }
  next();
});

dealSchema.index({ stage: 1, status: 1 });
dealSchema.index({ assignedAgent: 1 });

module.exports = mongoose.model('Deal', dealSchema);