import mongoose from 'mongoose';

const UpgradeRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  attachments: [{
    type: String, // file URLs
    required: true,
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
    index: true,
  },
  adminExplanation: {
    type: String,
    default: '',
  },
  rejectionComment: {
    type: String,
    default: '',
  },
  viewedByUser: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Enforce one pending request per user
UpgradeRequestSchema.index({ userId: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'pending' } });

export default mongoose.model('UpgradeRequest', UpgradeRequestSchema); 