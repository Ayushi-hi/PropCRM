const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String }, // pdf, docx, jpg, etc.
  fileSize: { type: Number }, // bytes
  entityType: {
    type: String,
    enum: ['deal', 'lead', 'client', 'property'],
    required: true,
  },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: {
    type: String,
    enum: ['agreement', 'contract', 'id-proof', 'site-plan', 'brochure', 'other'],
    default: 'other',
  },
  notes: { type: String },
}, { timestamps: true });

documentSchema.index({ entityType: 1, entityId: 1 });

module.exports = mongoose.model('Document', documentSchema);