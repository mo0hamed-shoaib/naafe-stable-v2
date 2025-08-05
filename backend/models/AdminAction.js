import mongoose from 'mongoose';

const adminActionSchema = new mongoose.Schema({
  // Which complaint this action is for
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true
  },
  
  // Which admin performed the action
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Admin is a User discriminator
    required: true
  },
  
  // Type of action performed
  actionType: {
    type: String,
    enum: ['investigate', 'resolve', 'dismiss', 'warning', 'suspension', 'ban', 'refund'],
    required: true
  },
  
  // Previous status before action
  previousStatus: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'dismissed'],
    required: true
  },
  
  // New status after action
  newStatus: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'dismissed'],
    required: true
  },
  
  // Previous admin action before this action
  previousAdminAction: {
    type: String,
    enum: ['warning', 'suspension', 'ban', 'refund', 'none'],
    default: 'none'
  },
  
  // New admin action after this action
  newAdminAction: {
    type: String,
    enum: ['warning', 'suspension', 'ban', 'refund', 'none'],
    default: 'none'
  },
  
  // Admin notes for this specific action
  notes: {
    type: String,
    maxlength: 1000
  },
  
  // IP address of admin (for security tracking)
  ipAddress: {
    type: String
  },
  
  // User agent (browser info)
  userAgent: {
    type: String
  },
  
  // Timestamp
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
adminActionSchema.index({ complaintId: 1, createdAt: -1 });
adminActionSchema.index({ adminId: 1, createdAt: -1 });
adminActionSchema.index({ actionType: 1, createdAt: -1 });

// Virtual for action type labels
adminActionSchema.virtual('actionTypeLabel').get(function() {
  const labels = {
    investigate: 'بدء التحقيق',
    resolve: 'حل البلاغ',
    dismiss: 'رفض البلاغ',
    warning: 'إعطاء تحذير',
    suspension: 'تعليق الحساب',
    ban: 'حظر الحساب',
    refund: 'استرداد المال'
  };
  return labels[this.actionType] || this.actionType;
});

// Virtual for status labels
adminActionSchema.virtual('previousStatusLabel').get(function() {
  const labels = {
    pending: 'انتظار',
    investigating: 'تحقيق',
    resolved: 'تم الحل',
    dismissed: 'مرفوض'
  };
  return labels[this.previousStatus] || this.previousStatus;
});

adminActionSchema.virtual('newStatusLabel').get(function() {
  const labels = {
    pending: 'انتظار',
    investigating: 'تحقيق',
    resolved: 'تم الحل',
    dismissed: 'مرفوض'
  };
  return labels[this.newStatus] || this.newStatus;
});

// Virtual for admin action labels
adminActionSchema.virtual('previousAdminActionLabel').get(function() {
  const labels = {
    warning: 'تحذير',
    suspension: 'تعليق',
    ban: 'حظر',
    refund: 'استرداد',
    none: 'لا إجراء'
  };
  return labels[this.previousAdminAction] || this.previousAdminAction;
});

adminActionSchema.virtual('newAdminActionLabel').get(function() {
  const labels = {
    warning: 'تحذير',
    suspension: 'تعليق',
    ban: 'حظر',
    refund: 'استرداد',
    none: 'لا إجراء'
  };
  return labels[this.newAdminAction] || this.newAdminAction;
});

// Ensure virtuals are included in JSON
adminActionSchema.set('toJSON', { virtuals: true });
adminActionSchema.set('toObject', { virtuals: true });

const AdminAction = mongoose.model('AdminAction', adminActionSchema);

export default AdminAction; 