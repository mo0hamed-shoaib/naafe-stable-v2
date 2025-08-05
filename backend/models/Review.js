import mongoose from 'mongoose';
const { Schema } = mongoose;

const reviewSchema = new Schema({
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['seeker', 'provider'],
    required: true,
    description: 'Context of the review: seeker or provider'
  },
  jobRequest: {
    type: Schema.Types.ObjectId,
    ref: 'JobRequest'
  },
  serviceListing: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceListing'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  reported: {
    type: Boolean,
    default: false
  },
  reportReason: String
}, {
  timestamps: true
});

// Indexes for querying reviews by user and role
reviewSchema.index({ reviewedUser: 1, role: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review; 