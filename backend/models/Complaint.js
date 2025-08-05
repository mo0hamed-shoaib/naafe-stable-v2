import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  // Who reported the problem
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Who is being reported
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Related job request
  jobRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobRequest',
    required: true
  },
  
  // Problem details
  problemType: {
    type: String,
    enum: ['late', 'no_show', 'incomplete_work', 'poor_quality', 'rude_behavior', 'price_dispute', 'other'],
    required: true
  },
  
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  // Admin handling
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'dismissed'],
    default: 'pending'
  },
  
  adminNotes: {
    type: String,
    maxlength: 1000
  },
  
  adminAction: {
    type: String,
    enum: ['warning', 'suspension', 'ban', 'refund', 'none'],
    default: 'none'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
complaintSchema.index({ status: 1, createdAt: -1 });
complaintSchema.index({ reportedUserId: 1 });
complaintSchema.index({ reporterId: 1 });
complaintSchema.index({ jobRequestId: 1 });

// Virtual for problem type labels
complaintSchema.virtual('problemTypeLabel').get(function() {
  const labels = {
    late: 'تأخر في الموعد',
    no_show: 'لم يحضر مقدم الخدمة',
    incomplete_work: 'لم يكمل العمل المطلوب',
    poor_quality: 'جودة العمل سيئة',
    rude_behavior: 'سلوك غير لائق',
    price_dispute: 'خلاف على السعر',
    other: 'مشكلة أخرى'
  };
  return labels[this.problemType] || this.problemType;
});

// Virtual for status labels
complaintSchema.virtual('statusLabel').get(function() {
  const labels = {
    pending: 'انتظار',
    investigating: 'تحقيق',
    resolved: 'تم الحل',
    dismissed: 'مرفوض'
  };
  return labels[this.status] || this.status;
});

// Virtual for admin action labels
complaintSchema.virtual('adminActionLabel').get(function() {
  const labels = {
    warning: 'تحذير',
    suspension: 'تعليق',
    ban: 'حظر',
    refund: 'استرداد',
    none: 'لا إجراء'
  };
  return labels[this.adminAction] || this.adminAction;
});

// Ensure virtuals are included in JSON
complaintSchema.set('toJSON', { virtuals: true });
complaintSchema.set('toObject', { virtuals: true });

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint; 