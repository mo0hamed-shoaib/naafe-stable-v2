import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['service_request', 'user', 'service_listing'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetModel'
  },
  targetModel: {
    type: String,
    required: true,
    enum: ['JobRequest', 'User', 'ServiceListing']
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'dismissed'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient querying
reportSchema.index({ reporter: 1, type: 1, targetId: 1 }, { unique: true });
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ type: 1, targetId: 1 });

// Pre-save middleware to set targetModel based on type
reportSchema.pre('save', function(next) {
  if (this.type === 'service_request') {
    this.targetModel = 'JobRequest';
  } else if (this.type === 'user') {
    this.targetModel = 'User';
  } else if (this.type === 'service_listing') {
    this.targetModel = 'ServiceListing';
  }
  next();
});

const Report = mongoose.model('Report', reportSchema);

export default Report; 