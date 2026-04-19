const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['call', 'email', 'visit', 'meeting', 'note'], default: 'note' },
  note: String,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
});

const clientSchema = new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  preferences: {
    propertyType: String,
    budget: Number,
    location: String,
  },
  interactionHistory: [interactionSchema],
  notes: { type: String },
  status: {
    type: String,
    enum: ['active', 'closed', 'inactive'],
    default: 'active',
  },
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);